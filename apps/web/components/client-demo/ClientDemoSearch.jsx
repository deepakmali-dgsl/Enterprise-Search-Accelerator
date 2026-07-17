"use client";

import { useState } from "react";
import { InstantSearch } from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import { CLIENT_DEMO_INDEX_NAME } from "@/lib/algoliaClientDemo";
import SearchBox from "./SearchBox";
import QuerySuggestions from "./QuerySuggestions";

/**
 * Wires the Country + Resource Group Algolia index into InstantSearch and
 * composes the large search box with its grouped query-suggestions
 * dropdown. This is a self-contained InstantSearch instance separate from
 * the existing /search page, so it cannot affect that page's behavior.
 */
export default function ClientDemoSearch() {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  return (
    <InstantSearch indexName={CLIENT_DEMO_INDEX_NAME} searchClient={searchClient}>
      <div className="relative mx-auto w-full max-w-2xl">
        <SearchBox
          controlsId="client-demo-suggestions"
          isExpanded={isSuggestionsOpen}
          onBlur={() => setIsSuggestionsOpen(false)}
          onFocus={() => setIsSuggestionsOpen(true)}
        />
        <QuerySuggestions
          isOpen={isSuggestionsOpen}
          listId="client-demo-suggestions"
          onSelect={() => setIsSuggestionsOpen(false)}
        />
      </div>
    </InstantSearch>
  );
}
