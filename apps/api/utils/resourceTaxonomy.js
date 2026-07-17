/**
 * The client's `resourceGroup.resources` field is a large, loosely-named
 * key/value bag of localized website copy (30-100+ keys per entry, mixed
 * naming conventions, occasionally nested one level deep) rather than a
 * clean "Visa Fee / Visa Type / Visa Document" structure. This module
 * applies a small set of generic key-pattern rules to bucket that bag into
 * a handful of recognizable resource categories, so the same logic works
 * for every country without hardcoding country-specific field names.
 */

const CATEGORIES = [
  {
    slug: "visa-fee",
    label: "Visa Fee",
    pattern: /fee|amount|price|charge/i,
  },
  {
    slug: "visa-type",
    label: "Visa Type",
    pattern: /visa-?type|onepager|process-?type/i,
  },
  {
    slug: "visa-document",
    label: "Visa Document",
    pattern: /document|checklist|negotiable-instrument|requirement/i,
  },
  {
    slug: "appointment",
    label: "Appointment & Scheduling",
    pattern: /appointment|reschedule|book.*service|schedule/i,
  },
  {
    slug: "contact-support",
    label: "Contact & Support",
    pattern: /contactus|clicktotalk|embassy|helpline/i,
  },
];

const FALLBACK_CATEGORY = { slug: "general", label: "General Resources" };

const MAX_FLATTEN_DEPTH = 3;
const MAX_SNIPPET_LENGTH = 220;

/**
 * Flattens the (possibly nested) resources object into dot-path -> string
 * leaf pairs, e.g. { additionalservices: { cou: { official: "26,84$" } } }
 * becomes { "additionalservices.cou.official": "26,84$" }.
 *
 * @param {unknown} resources - Raw Contentful JSON object field value.
 * @param {string} [prefix]
 * @param {number} [depth]
 * @returns {Record<string, string>}
 */
function flattenResources(resources, prefix = "", depth = 0) {
  if (!resources || typeof resources !== "object" || depth > MAX_FLATTEN_DEPTH) {
    return {};
  }

  const flattened = {};

  for (const [key, value] of Object.entries(resources)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value == null) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number") {
      const stringValue = String(value).trim();
      if (stringValue) {
        flattened[path] = stringValue;
      }
    } else if (typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flattened, flattenResources(value, path, depth + 1));
    }
  }

  return flattened;
}

function truncate(value) {
  return value.length > MAX_SNIPPET_LENGTH
    ? `${value.slice(0, MAX_SNIPPET_LENGTH - 1)}…`
    : value;
}

/**
 * Buckets a resourceGroup's `resources` field into resource categories.
 * Every category that has at least one matching key is returned, each with
 * one representative snippet. Entries with no recognizable category still
 * produce a single "General Resources" bucket so no data is silently
 * dropped from the index.
 *
 * @param {unknown} resources - Raw Contentful JSON object field value.
 * @returns {{ slug: string, label: string, key: string, snippet: string }[]}
 */
function categorizeResources(resources) {
  const flattened = flattenResources(resources);
  const entries = Object.entries(flattened);
  const results = [];

  for (const category of CATEGORIES) {
    const match = entries.find(([key]) => category.pattern.test(key));

    if (match) {
      const [key, value] = match;
      results.push({ ...category, key, snippet: truncate(value) });
    }
  }

  if (results.length === 0 && entries.length > 0) {
    const [key, value] = entries[0];
    results.push({ ...FALLBACK_CATEGORY, key, snippet: truncate(value) });
  }

  return results;
}

module.exports = {
  categorizeResources,
  flattenResources,
};
