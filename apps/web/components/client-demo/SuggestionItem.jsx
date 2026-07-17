"use client";

import { FileText, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * One row inside a CountryGroup: either a specific resource (Visa Fee, Visa
 * Type, ...) or, when `categoryLabel` is omitted, the country entry itself.
 */
export default function SuggestionItem({ hit, onSelect }) {
  const isCountryOnly = hit.recordType === "country";

  return (
    <Button
      className="h-auto w-full justify-start gap-3 px-3 py-2.5 text-left font-normal"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onSelect(hit)}
      role="option"
      type="button"
      variant="ghost"
    >
      {isCountryOnly ? (
        <Globe2 aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
      ) : (
        <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {isCountryOnly ? `${hit.country} overview` : hit.categoryLabel}
        </span>
        {hit.snippet ? (
          <span className="block truncate text-xs text-muted-foreground">
            {hit.snippet}
          </span>
        ) : null}
      </span>
    </Button>
  );
}
