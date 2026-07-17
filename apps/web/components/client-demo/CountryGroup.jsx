"use client";

import { Separator } from "@/components/ui/separator";
import SuggestionItem from "./SuggestionItem";

/**
 * One country section within the query suggestions dropdown: a country
 * heading followed by its matched resource suggestions (Visa Fee, Visa
 * Type, Visa Document, ...).
 */
export default function CountryGroup({ country, hits, onSelect, showDivider = true }) {
  return (
    <div className="px-1 py-2 first:pt-1 last:pb-1">
      <p className="px-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {country}
      </p>
      <div className="space-y-0.5">
        {hits.map((hit) => (
          <SuggestionItem hit={hit} key={hit.objectID} onSelect={onSelect} />
        ))}
      </div>
      {showDivider ? <Separator className="mt-2" /> : null}
    </div>
  );
}
