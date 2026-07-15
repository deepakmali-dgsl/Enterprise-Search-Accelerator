"use client";

import { InstantSearch, SearchBox } from "react-instantsearch";
import { searchClient } from "@/lib/algolia";
import SearchResults from "./SearchResults";

export default function SearchClient() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
    >
      <div className="space-y-6">
        <SearchBox
          placeholder="Search visa information..."
        />

        <SearchResults />
      </div>
    </InstantSearch>
  );
}