const algoliaService = require("./algoliaService");
const contentfulService = require("./contentfulService");
const {
  transformCountryEntry,
  transformResourceGroupEntry,
} = require("../utils/clientDemoTransformer");
const clientDemoIndexSettings = require("../config/clientDemoIndexSettings");
const logger = require("../utils/logger");

/**
 * Synchronizes the client demo content (Country + Resource Group) into the
 * dedicated ALGOLIA_CLIENT_DEMO_INDEX_NAME index. This is entirely separate
 * from syncAllVisaInformation() and the shared ALGOLIA_INDEX_NAME index, so
 * the existing search experience is unaffected.
 *
 * @returns {Promise<{ syncedCount: number, task: unknown }>} Sync summary.
 */
async function syncClientDemo() {
  logger.info("sync.client_demo.started");

  const [countries, resourceGroups] = await Promise.all([
    contentfulService.getCountries(),
    contentfulService.getResourceGroups(),
  ]);

  logger.info("sync.client_demo.entries_fetched", {
    countryCount: countries.length,
    resourceGroupCount: resourceGroups.length,
  });

  const records = [
    ...countries.map(transformCountryEntry),
    ...resourceGroups.flatMap(transformResourceGroupEntry),
  ];

  const indexName = algoliaService.getClientDemoIndexName();
  await algoliaService.setIndexSettings(indexName, clientDemoIndexSettings);
  const task = await algoliaService.saveObjectsToIndex(indexName, records);

  logger.info("sync.client_demo.completed", { syncedCount: records.length });
  return { syncedCount: records.length, task };
}

module.exports = {
  syncClientDemo,
};
