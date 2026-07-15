require("dotenv").config();

const contentful = require("contentful");
const { algoliasearch } = require("algoliasearch");

// Contentful Client
const contentfulClient = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Algolia Client
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

async function syncContent() {
  try {
    console.log("Reading entries from Contentful...");

    const response = await contentfulClient.getEntries({
      content_type: "visaInformation",
    });

    console.log(`Found ${response.items.length} entries`);

    const records = response.items.map((item) => ({
      objectID: item.sys.id,
      country: item.fields.country || "",
      applyFrom: item.fields.applyFrom || "",
      visaType: item.fields.visaType || "",
      visaFee: item.fields.visaFee || 0,
      currency: item.fields.currency || "",
      processingTime: item.fields.processingTime || "",
      appointmentUrl: item.fields.appointmentUrl || "",
      rescheduleUrl: item.fields.rescheduleUrl || "",
      keywords: item.fields.keywords || [],
      description: item.fields.description || "",
    }));

    await algoliaClient.saveObjects({
      indexName: process.env.ALGOLIA_INDEX_NAME,
      objects: records,
    });

    console.log("=================================");
    console.log("Successfully synced to Algolia!");
    console.log("=================================");
  } catch (error) {
    console.error(error);
  }
}

syncContent();