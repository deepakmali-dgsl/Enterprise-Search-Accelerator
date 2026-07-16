const crypto = require("crypto");
const syncService = require("../services/syncService");
const logger = require("../utils/logger");

const EVENT_ACTIONS = {
  "ContentManagement.Entry.publish": "upsert",
  "ContentManagement.Entry.unpublish": "delete",
  "ContentManagement.Entry.delete": "delete",
};
const SIGNATURE_TTL_MS = 60 * 1000;

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getHeaderValue(headers, name) {
  const value = headers[name];
  return Array.isArray(value) ? value.join(",") : value;
}

/**
 * Verifies a signed Contentful webhook when a signing secret is configured.
 * Signature verification is intentionally optional during local development;
 * production should set CONTENTFUL_WEBHOOK_SECRET and enable signing in
 * Contentful's webhook settings.
 *
 * @param {import("express").Request} req - Incoming webhook request.
 * @returns {boolean} Whether the request is valid.
 */
function isValidSignature(req) {
  const signingSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;

  if (!signingSecret) {
    return true;
  }

  const signature = getHeaderValue(req.headers, "x-contentful-signature");
  const timestamp = Number(getHeaderValue(req.headers, "x-contentful-timestamp"));
  const signedHeaders = getHeaderValue(req.headers, "x-contentful-signed-headers");

  if (!signature || !signedHeaders || !Number.isFinite(timestamp)) {
    return false;
  }

  if (Math.abs(Date.now() - timestamp) > SIGNATURE_TTL_MS) {
    return false;
  }

  const canonicalHeaders = signedHeaders
    .split(",")
    .map((headerName) => headerName.trim().toLowerCase())
    .filter(Boolean)
    .map((headerName) => {
      const headerValue = getHeaderValue(req.headers, headerName);
      return headerValue === undefined ? null : `${headerName}:${headerValue}`;
    });

  if (canonicalHeaders.length === 0 || canonicalHeaders.includes(null)) {
    return false;
  }

  const canonicalRequest = [
    req.method,
    req.originalUrl,
    canonicalHeaders.join(";"),
    req.rawBody?.toString("utf8") || "",
  ].join("\n");
  const expectedSignature = crypto
    .createHmac("sha256", signingSecret)
    .update(canonicalRequest)
    .digest("hex");
  const receivedSignature = Buffer.from(signature, "utf8");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "utf8");

  return (
    receivedSignature.length === expectedSignatureBuffer.length &&
    crypto.timingSafeEqual(receivedSignature, expectedSignatureBuffer)
  );
}

function isMissingEntryError(error) {
  return error?.status === 404 || error?.sys?.id === "NotFound";
}

/**
 * Processes Contentful Entry publish, unpublish, and delete webhook events.
 *
 * @param {import("express").Request} req - Webhook request.
 * @param {import("express").Response} res - Webhook response.
 * @param {import("express").NextFunction} next - Express error handler.
 * @returns {Promise<void>}
 */
async function handleContentfulWebhook(req, res, next) {
  const topic = getHeaderValue(req.headers, "x-contentful-topic");
  const action = EVENT_ACTIONS[topic];
  const entryId = req.body?.sys?.id;
  const idempotencyKey = getHeaderValue(req.headers, "x-contentful-idempotency-key");

  logger.info("webhook.received", { topic, entryId, idempotencyKey });

  try {
    if (!isValidSignature(req)) {
      throw createHttpError(403, "Invalid Contentful webhook signature.");
    }

    if (!action) {
      logger.info("webhook.ignored", { topic, reason: "unsupported_topic" });
      res.status(204).end();
      return;
    }

    if (!entryId) {
      throw createHttpError(400, "Webhook payload is missing sys.id.");
    }

    logger.info("webhook.processing", { topic, entryId, action, idempotencyKey });
    const result =
      action === "upsert"
        ? await syncService.syncEntry(entryId)
        : await syncService.removeEntry(entryId);

    logger.info("webhook.completed", { topic, entryId, action, idempotencyKey });
    res.status(200).json({ status: "synchronized", action, entryId: result.objectID });
  } catch (error) {
    if (isMissingEntryError(error)) {
      error = createHttpError(404, `Contentful entry ${entryId} was not found.`);
    }

    logger.error("webhook.failed", {
      topic,
      entryId,
      idempotencyKey,
      retryable: !error.statusCode || error.statusCode >= 500,
      error: error.message,
    });
    next(error);
  }
}

module.exports = {
  handleContentfulWebhook,
  isValidSignature,
};
