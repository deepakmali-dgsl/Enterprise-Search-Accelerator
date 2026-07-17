const algoliaService = require("./algoliaService");
const contentfulService = require("./contentfulService");
const { transformVisaInformation } = require("../utils/transformer");
const logger = require("../utils/logger");
const { PDFParse } = require("pdf-parse");

/**
 * Converts a Contentful Asset URL into an absolute URL when Contentful returns
 * a protocol-relative value.
 *
 * @param {import("contentful").Asset | undefined} asset - Contentful document asset.
 * @returns {string} PDF URL, or an empty string when no file is available.
 */
function getPdfUrl(asset) {
  const url = asset?.fields?.file?.url;

  if (!url || typeof url !== "string") {
    return "";
  }

  return url.startsWith("//") ? `https:${url}` : url;
}

/**
 * Finds the PDF Asset without relying on a particular Contentful field ID.
 * CONTENTFUL_PDF_FIELD_ID can be set when the content model has multiple
 * assets; otherwise the first PDF asset is used.
 *
 * @param {Record<string, unknown>} fields - Contentful entry fields.
 * @returns {{ fieldId: string, asset: import("contentful").Asset } | null}
 */
function findPdfAsset(fields) {
  const configuredFieldId = process.env.CONTENTFUL_PDF_FIELD_ID;

  if (configuredFieldId && fields[configuredFieldId]) {
    return { fieldId: configuredFieldId, asset: fields[configuredFieldId] };
  }

  for (const [fieldId, value] of Object.entries(fields)) {
    const file = value?.fields?.file;
    const fileUrl = file?.url || "";

    if (file?.contentType === "application/pdf" || fileUrl.toLowerCase().endsWith(".pdf")) {
      return { fieldId, asset: value };
    }
  }

  return null;
}

/**
 * Downloads a visa document and extracts its searchable text. A missing or
 * unreadable PDF must not prevent the entry's structured fields from syncing.
 *
 * @param {import("contentful").Entry} entry - Contentful visa information entry.
 * @returns {Promise<{ pdfUrl: string, pdfContent: string }>}
 */
async function getPdfSearchData(entry) {
  const fields = entry?.fields || {};
  const fieldIds = Object.keys(fields);
  console.log(Object.keys(entry.fields || {}));

  const pdfField = findPdfAsset(fields);

  if (!pdfField) {
    logger.warn("sync.pdf.missing", {
      entryId: entry?.sys?.id,
      availableFieldIds: fieldIds,
      configuredFieldId: process.env.CONTENTFUL_PDF_FIELD_ID || null,
    });
    return { pdfUrl: "", pdfContent: "" };
  }

  const pdfUrl = getPdfUrl(pdfField.asset);

  if (!pdfUrl) {
    logger.warn("sync.pdf.url_missing", {
      entryId: entry?.sys?.id,
      fieldId: pdfField.fieldId,
      availableFieldIds: fieldIds,
    });
    return { pdfUrl: "", pdfContent: "" };
  }

  let parser;

  try {
    console.log("Resolved PDF URL:", pdfUrl);
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error(`PDF download failed with status ${response.status}.`);
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    parser = new PDFParse({ data: pdfBuffer });
    const result = await parser.getText();
    const pdfContent = result.text || "";
    console.log("Extracted PDF text length:", pdfContent.length);

    logger.info("sync.pdf.extracted", {
      entryId: entry.sys.id,
      fieldId: pdfField.fieldId,
      contentLength: pdfContent.length,
    });

    return { pdfUrl, pdfContent };
  } catch (error) {
    logger.warn("sync.pdf.extraction_failed", {
      entryId: entry?.sys?.id,
      message: error instanceof Error ? error.message : String(error),
    });
    return { pdfUrl, pdfContent: "" };
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (error) {
        logger.warn("sync.pdf.parser_cleanup_failed", {
          entryId: entry?.sys?.id,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }
}

/**
 * Adds document search data to the existing Algolia record.
 *
 * @param {import("contentful").Entry} entry - Contentful visa information entry.
 * @returns {Promise<Record<string, unknown>>} Algolia-ready record.
 */
async function transformVisaInformationWithPdf(entry) {
  const record = transformVisaInformation(entry);
  const pdfSearchData = await getPdfSearchData(entry);
  const enrichedRecord = { ...record, ...pdfSearchData };

  logger.info("sync.pdf.record_enriched", {
    entryId: record.objectID,
    hasPdfUrl: Boolean(enrichedRecord.pdfUrl),
    pdfContentLength: enrichedRecord.pdfContent.length,
  });

  return enrichedRecord;
}

/**
 * Prints the exact record shape that will be sent to Algolia for debugging.
 *
 * @param {Record<string, unknown>} record - Algolia-ready record.
 */
function logAlgoliaRecord(record) {
  console.log("Algolia record before indexing:", JSON.stringify(record, null, 2));
}

/**
 * Synchronizes every published visaInformation entry to Algolia.
 *
 * @returns {Promise<{ syncedCount: number, task: unknown }>} Sync summary.
 */
async function syncAllVisaInformation() {
  logger.info("sync.all.started");
  const entries = await contentfulService.getVisaInformation();
  logger.info("sync.all.entries_fetched", { entryCount: entries.length });

  const records = await Promise.all(entries.map(transformVisaInformationWithPdf));
  if (records[0]) {
    logAlgoliaRecord(records[0]);
  }
  const task = await algoliaService.saveObjects(records);

  logger.info("sync.all.completed", { syncedCount: records.length });
  return { syncedCount: records.length, task };
}

/**
 * Fetches, transforms, and upserts one published Contentful entry.
 *
 * @param {string} entryId - Contentful entry identifier.
 * @returns {Promise<{ objectID: string, task: unknown }>} Sync summary.
 */
async function syncEntry(entryId) {
  logger.info("sync.entry.started", { entryId });
  const entry = await contentfulService.getEntryById(entryId);
  const record = await transformVisaInformationWithPdf(entry);
  logAlgoliaRecord(record);
  const task = await algoliaService.updateObject(record);

  logger.info("sync.entry.completed", { entryId, objectID: record.objectID });
  return { objectID: record.objectID, task };
}

/**
 * Removes the record corresponding to a Contentful entry.
 *
 * @param {string} entryId - Contentful entry identifier.
 * @returns {Promise<{ objectID: string, task: unknown }>} Delete summary.
 */
async function removeEntry(entryId) {
  logger.info("sync.entry_removal.started", { entryId });
  const task = await algoliaService.deleteObject(entryId);

  logger.info("sync.entry_removal.completed", { entryId });
  return { objectID: entryId, task };
}

module.exports = {
  removeEntry,
  syncAllVisaInformation,
  syncEntry,
};
