"use client";

import { useHits, useSearchBox } from "react-instantsearch";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_SUGGESTIONS = 5;

export default function SearchSuggestions({
  isOpen,
  listId = "search-suggestions",
  onSelect,
}) {
  const { hits } = useHits();
  const { query, refine } = useSearchBox();
  const suggestions = hits
    .flatMap((hit) => [
      { label: `${hit.country} Visa`, query: `${hit.country} Visa` },
      { label: `${hit.country} Visa Fee`, query: `${hit.country} Visa Fee` },
      {
        label: `${hit.country} Processing Time`,
        query: `${hit.country} Processing Time`,
      },
    ])
    .filter((suggestion, index, allSuggestions) =>
      allSuggestions.findIndex(({ label }) => label === suggestion.label) === index
    )
    .slice(0, MAX_SUGGESTIONS);

  if (!isOpen || !query.trim() || suggestions.length === 0) {
    return null;
  }

  function handleSelect(suggestion) {
    refine(suggestion.query);
    onSelect?.();
  }

  return (
    <div
      aria-label="Search suggestions"
      className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-popover p-1 shadow-lg"
      id={listId}
      role="listbox"
    >
      {suggestions.map((suggestion) => (
        <Button
          className="h-auto w-full justify-start gap-3 px-3 py-3 text-left font-normal"
          key={suggestion.query}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => handleSelect(suggestion)}
          role="option"
          type="button"
          variant="ghost"
        >
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 truncate">
            {suggestion.label}
          </span>
        </Button>
      ))}
    </div>
  );
}
