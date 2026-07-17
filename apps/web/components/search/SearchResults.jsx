"use client";

import { useHits, useInstantSearch, useSearchBox } from "react-instantsearch";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import VisaCard from "./VisaCard";

export default function SearchResults() {
  const { hits } = useHits();
  const { status } = useInstantSearch();
  const { query, refine } = useSearchBox();

  if (status === "loading" || status === "stalled") {
    return <LoadingState />;
  }

  if (hits.length === 0) {
    return <EmptyState onClear={() => refine("")} query={query} />;
  }

  return (
    <div
      aria-label="Visa search results"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {hits.map((hit) => (
        <VisaCard hit={hit} key={hit.objectID} />
      ))}
    </div>
  );
}
