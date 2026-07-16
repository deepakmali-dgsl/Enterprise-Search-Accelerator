const client = require("../config/algolia");

function getIndexName() {
  if (!process.env.ALGOLIA_INDEX_NAME) {
    throw new Error("ALGOLIA_INDEX_NAME is not configured.");
  }

  return process.env.ALGOLIA_INDEX_NAME;
}

/**
 * Saves records to Algolia. Matching objectIDs are updated, making this
 * operation idempotent.
 *
 * @param {Record<string, unknown>[]} records - Algolia search records.
 * @returns {Promise<unknown>} Algolia write task response.
 */
async function saveObjects(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return null;
  }

  return client.saveObjects({
    indexName: getIndexName(),
    objects: records,
  });
}

/**
 * Updates one Algolia record using its Contentful entry ID as objectID.
 *
 * @param {Record<string, unknown>} record - Algolia search record.
 * @returns {Promise<unknown>} Algolia write task response.
 */
async function updateObject(record) {
  if (!record?.objectID) {
    throw new TypeError("An Algolia record with objectID is required.");
  }

  return saveObjects([record]);
}

/**
 * Removes an Algolia record by its Contentful entry ID.
 *
 * @param {string} objectID - Algolia object identifier.
 * @returns {Promise<unknown>} Algolia delete task response.
 */
async function deleteObject(objectID) {
  if (!objectID) {
    throw new TypeError("An Algolia objectID is required.");
  }

  return client.deleteObject({
    indexName: getIndexName(),
    objectID,
  });
}

/**
 * Clears all objects from the configured Algolia index.
 *
 * @returns {Promise<unknown>} Algolia clear task response.
 */
async function clearIndex() {
  return client.clearObjects({
    indexName: getIndexName(),
  });
}

module.exports = {
  save: saveObjects,
  saveObjects,
  updateObject,
  deleteObject,
  clearIndex,
};
