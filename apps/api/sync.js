require("dotenv").config();

const syncService = require("./services/syncService");

async function syncContent() {
  try {
    console.log("Reading entries from Contentful...");
    const { syncedCount } = await syncService.syncAllVisaInformation();

    console.log(`Successfully synced ${syncedCount} entries to Algolia!`);
  } catch (error) {
    console.error("Content sync failed:", error);
    process.exitCode = 1;
  }
}

syncContent();
