const algoliaService = require("./algoliaService");
const contentfulService = require("./contentfulService");
const { transformVisaInformation } = require("../utils/transformer");
const logger = require("../utils/logger");

/**
 * Synchronizes every published visaInformation entry to Algolia.
 *
 * @returns {Promise<{ syncedCount: number, task: unknown }>} Sync summary.
 */
async function syncAllVisaInformation() {
  logger.info("sync.all.started");
  const entries = await contentfulService.getVisaInformation();
  logger.info("sync.all.entries_fetched", { entryCount: entries.length });

  const records = entries.map(transformVisaInformation);
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
  const record = transformVisaInformation(entry);
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
