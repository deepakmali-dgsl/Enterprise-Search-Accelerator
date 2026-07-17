"use client";

import { useSearchBox } from "react-instantsearch";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchInput({
  placeholder = "Search visa information...",
  onFocus,
  onBlur,
  isExpanded = false,
  controlsId,
}) {
  const { query, refine } = useSearchBox();

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="visa-search">
        Search visa information
      </label>

      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        aria-autocomplete="list"
        aria-controls={controlsId}
        aria-expanded={isExpanded}
        className="h-14 pr-12 pl-12 text-base shadow-sm"
        id="visa-search"
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
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => refine("")}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
