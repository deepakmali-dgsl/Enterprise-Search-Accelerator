/**
 * Emits structured JSON logs suitable for collection by a platform logger.
 *
 * @param {"error" | "info" | "warn"} level - Console severity.
 * @param {string} event - Stable event name for querying and alerting.
 * @param {Record<string, unknown>} [details] - Non-sensitive event metadata.
 */
function log(level, event, details = {}) {
  const message = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details,
  });

  console[level](message);
}

module.exports = {
  error: (event, details) => log("error", event, details),
  info: (event, details) => log("info", event, details),
  warn: (event, details) => log("warn", event, details),
};
