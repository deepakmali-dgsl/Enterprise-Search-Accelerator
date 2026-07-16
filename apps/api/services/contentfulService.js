const client = require("../config/contentful");

/**
 * Fetches every published visa information entry.
 *
 * @returns {Promise<import("contentful").Entry[]>} Published entries.
 */
async function getVisaInformation() {
  const response = await client.getEntries({
    content_type: "visaInformation",
  });

  return response.items;
}

/**
 * Fetches one published Contentful entry by ID.
 *
 * @param {string} entryId - Contentful entry identifier.
 * @returns {Promise<import("contentful").Entry>} The requested entry.
 */
async function getEntry(entryId) {
  if (!entryId) {
    throw new TypeError("A Contentful entry ID is required.");
  }

  return client.getEntry(entryId);
}

/**
 * Alias that makes webhook entry-ID call sites explicit.
 *
 * @param {string} entryId - Contentful entry identifier.
 * @returns {Promise<import("contentful").Entry>} The requested entry.
 */
async function getEntryById(entryId) {
  return getEntry(entryId);
}

module.exports = {
  getVisaInformation,
  getEntry,
  getEntryById,
};
