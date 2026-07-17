require("dotenv").config();

const clientDemoSyncService = require("./services/clientDemoSyncService");

async function syncContent() {
  try {
    console.log("Reading Country and Resource Group entries from Contentful...");
    const { syncedCount } = await clientDemoSyncService.syncClientDemo();

    console.log(`Successfully synced ${syncedCount} client-demo records to Algolia!`);
  } catch (error) {
    console.error("Client demo content sync failed:", error);
    process.exitCode = 1;
  }
}

syncContent();
