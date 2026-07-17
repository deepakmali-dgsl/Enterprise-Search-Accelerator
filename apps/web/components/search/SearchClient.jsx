"use client";

import { useState } from "react";
import { InstantSearch } from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import SearchResults from "./SearchResults";
import SearchInput from "./SearchInput";
import SearchSuggestions from "./SearchSuggestions";
import ResultCount from "./ResultCount";

export default function SearchClient({ initialQuery = "" }) {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      initialUiState={{
        [indexName]: { query: initialQuery },
      }}
    >
      <div className="relative mb-8">
        <SearchInput
          controlsId="search-suggestions"
          isExpanded={isSuggestionsOpen}
          onBlur={() => setIsSuggestionsOpen(false)}
          onFocus={() => setIsSuggestionsOpen(true)}
          placeholder="Search visa information..."
        />
        <SearchSuggestions
          isOpen={isSuggestionsOpen}
          listId="search-suggestions"
          onSelect={() => setIsSuggestionsOpen(false)}
        />
      </div>
      <div className="mb-4">
        <ResultCount />
      </div>
      <SearchResults />
    </InstantSearch>
  );
}
