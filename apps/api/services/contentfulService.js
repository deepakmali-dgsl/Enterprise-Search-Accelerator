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
 * Fetches every published entry of a given content type, paginating past
 * Contentful's default page size so large content types are never silently
 * truncated.
 *
 * @param {string} contentType - Contentful content type ID.
 * @returns {Promise<import("contentful").Entry[]>} All published entries.
 */
async function getAllEntriesOfType(contentType) {
  const pageSize = 100;
  const items = [];
  let skip = 0;
  let total = Infinity;

  while (skip < total) {
    const response = await client.getEntries({
      content_type: contentType,
      limit: pageSize,
      skip,
    });

    items.push(...response.items);
    total = response.total;
    skip += pageSize;
  }

  return items;
}

/**
 * Fetches every published Country entry.
 *
 * @returns {Promise<import("contentful").Entry[]>} Published entries.
 */
async function getCountries() {
  return getAllEntriesOfType("country");
}

/**
 * Fetches every published Resource Group entry.
 *
 * @returns {Promise<import("contentful").Entry[]>} Published entries.
 */
async function getResourceGroups() {
  return getAllEntriesOfType("resourceGroup");
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
  getCountries,
  getResourceGroups,
  getEntry,
  getEntryById,
};
