"use client";

import { useSearchBox } from "react-instantsearch";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Large, modern search box for the client demo page. Mirrors the hooks-based
 * pattern used by the existing search page's SearchInput, but styled larger
 * to read as the page's primary call to action.
 */
export default function SearchBox({
  placeholder = "Search a country or visa resource…",
  onFocus,
  onBlur,
  isExpanded = false,
  controlsId,
}) {
  const { query, refine } = useSearchBox();

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="client-demo-search">
        Search countries and visa resources
      </label>

      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        aria-autocomplete="list"
        aria-controls={controlsId}
        aria-expanded={isExpanded}
        className="h-16 rounded-2xl pr-14 pl-14 text-lg shadow-lg"
        id="client-demo-search"
        onBlur={onBlur}
        value={query}
        onChange={(event) => refine(event.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        role="combobox"
      />

      {query ? (
        <Button
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => refine("")}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </Button>
      ) : null}
    </div>
  );
}
