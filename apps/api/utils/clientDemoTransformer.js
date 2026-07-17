const { parseLocaleParts } = require("./localeParser");
const { resolveCountryName } = require("./countryCodes");
const { categorizeResources } = require("./resourceTaxonomy");

/**
 * Converts a Contentful `country` entry into a single Algolia record. The
 * mission country (the country a visa is being sought for) is treated as
 * "the country" for search purposes, matching how a user searches ("India
 * Visa" means a visa for India). Entries with no mission segment fall back
 * to the residence country so every entry still produces a usable record.
 *
 * @param {import("contentful").Entry} entry - Contentful `country` entry.
 * @returns {Record<string, unknown>} Algolia-ready search record.
 */
function transformCountryEntry(entry) {
  const fields = entry.fields || {};
  const { residenceCode, missionCode, localeCode } = parseLocaleParts(fields.name);
  const countryCode = missionCode || residenceCode;

  return {
    objectID: `country-${entry.sys.id}`,
    recordType: "country",
    country: resolveCountryName(countryCode),
    countryCode,
    residenceCountry: resolveCountryName(residenceCode),
    residenceCountryCode: residenceCode,
    locale: localeCode,
    heading: fields.heading || "",
    keywords: [resolveCountryName(countryCode), countryCode].filter(Boolean),
  };
}

/**
 * Converts a Contentful `resourceGroup` entry into one Algolia record per
 * matched resource category (Visa Fee, Visa Type, Visa Document, ...), so
 * each record is a focused, independently-searchable suggestion grouped by
 * country in the UI. See resourceTaxonomy.js for the categorization rules.
 *
 * @param {import("contentful").Entry} entry - Contentful `resourceGroup` entry.
 * @returns {Record<string, unknown>[]} Algolia-ready search records.
 */
function transformResourceGroupEntry(entry) {
  const fields = entry.fields || {};
  const { residenceCode, missionCode, localeCode } = parseLocaleParts(fields.locale);
  const countryCode = missionCode || residenceCode;
  const countryName = resolveCountryName(countryCode);
  const categories = categorizeResources(fields.resources);

  return categories.map((category) => ({
    objectID: `resource-${entry.sys.id}-${category.slug}`,
    recordType: "resource",
    country: countryName,
    countryCode,
    residenceCountry: resolveCountryName(residenceCode),
    residenceCountryCode: residenceCode,
    locale: localeCode,
    resourceGroupId: entry.sys.id,
    category: category.slug,
    categoryLabel: category.label,
    title: fields.title || `${countryName} ${category.label}`,
    snippet: category.snippet,
    keywords: [countryName, category.label, countryCode].filter(Boolean),
  }));
}

module.exports = {
  transformCountryEntry,
  transformResourceGroupEntry,
};
