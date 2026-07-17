/**
 * Index settings for the client-demo index. `country` matches must be
 * required (typed country names should never fall back to unrelated
 * countries), while generic category words are optional so a country with
 * no matching resource records still surfaces on its own, e.g. "India Visa"
 * still returns India even though this sample dataset has no India
 * resourceGroup.
 */
module.exports = {
  searchableAttributes: [
    "unordered(country)",
    "unordered(title)",
    "unordered(categoryLabel)",
    "keywords",
    "unordered(snippet)",
  ],
  attributesForFaceting: ["searchable(country)", "recordType", "category"],
  typoTolerance: true,
  removeWordsIfNoResults: "none",
  optionalWords: [
    "visa",
    "fee",
    "fees",
    "type",
    "types",
    "document",
    "documents",
    "checklist",
  ],
};
