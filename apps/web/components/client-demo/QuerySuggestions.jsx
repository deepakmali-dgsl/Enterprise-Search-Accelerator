"use client";

import { useRouter } from "next/navigation";
import { useHits, useSearchBox } from "react-instantsearch";
import CountryGroup from "./CountryGroup";

const MAX_GROUPS = 5;
const MAX_ITEMS_PER_GROUP = 4;

/**
 * Groups the current Algolia hits by country and renders them as a
 * dropdown of query suggestions, e.g. typing "Visa" surfaces every matching
 * country with its Visa Fee / Visa Type / Visa Document resources nested
 * underneath. Grouping happens client-side over the hits already returned
 * by InstantSearch, the same "derive suggestions from hits" pattern the
 * existing search page's SearchSuggestions component uses.
 */
export default function QuerySuggestions({ isOpen, listId = "client-demo-suggestions", onSelect }) {
  const { hits } = useHits();
  const { query } = useSearchBox();
  const router = useRouter();

  const groups = [];
  const groupIndexByCountry = new Map();

  for (const hit of hits) {
    if (!hit.country) continue;

    let group = groupIndexByCountry.has(hit.country)
      ? groups[groupIndexByCountry.get(hit.country)]
      : null;

    if (!group) {
      if (groups.length >= MAX_GROUPS) continue;
      group = { country: hit.country, hits: [], categorySeen: new Set() };
      groupIndexByCountry.set(hit.country, groups.length);
      groups.push(group);
    }

    if (group.hits.length >= MAX_ITEMS_PER_GROUP) continue;

    // Collapse duplicate categories within a country (multiple resourceGroup
    // entries can map to the same country) so the dropdown stays scannable.
    const dedupeKey = hit.recordType === "country" ? "country" : hit.category;
    if (group.categorySeen.has(dedupeKey)) continue;
    group.categorySeen.add(dedupeKey);

    group.hits.push(hit);
  }

  if (!isOpen || !query.trim() || groups.length === 0) {
    return null;
  }

  function handleSelect(hit) {
    const params = new URLSearchParams({
      country: hit.country,
      recordType: hit.recordType,
    });
    if (hit.categoryLabel) params.set("category", hit.categoryLabel);
    if (hit.snippet) params.set("snippet", hit.snippet);

    router.push(`/client-demo/resource?${params.toString()}`);
    onSelect?.();
  }

  return (
    <div
      aria-label="Search suggestions"
      className="absolute z-20 mt-2 max-h-[28rem] w-full overflow-y-auto rounded-2xl border bg-popover p-1 shadow-xl"
      id={listId}
      role="listbox"
    >
      {groups.map((group, index) => (
        <CountryGroup
          country={group.country}
          hits={group.hits}
          key={group.country}
          onSelect={handleSelect}
          showDivider={index < groups.length - 1}
        />
      ))}
    </div>
  );
}
