/**
 * Converts a Contentful visaInformation entry into the search document stored
 * in Algolia. The Contentful entry ID is deliberately retained as objectID so
 * repeated synchronizations update the same record.
 *
 * @param {import("contentful").Entry} entry - Contentful entry to transform.
 * @returns {Record<string, unknown>} Algolia-ready search record.
 * @throws {TypeError} When the entry is missing its Contentful system ID.
 */
function transformVisaInformation(entry) {
  if (!entry?.sys?.id) {
    throw new TypeError("Cannot transform a Contentful entry without a system ID.");
  }

  const fields = entry.fields || {};

  return {
    objectID: entry.sys.id,
    country: fields.country || "",
    applyFrom: fields.applyFrom || "",
    visaType: fields.visaType || "",
    visaFee: fields.visaFee || 0,
    currency: fields.currency || "",
    processingTime: fields.processingTime || "",
    appointmentUrl: fields.appointmentUrl || "",
    rescheduleUrl: fields.rescheduleUrl || "",
    keywords: fields.keywords || [],
    description: fields.description || "",
  };
}

module.exports = {
  transformVisaInformation,
};
