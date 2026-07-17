"use client";

import { useSearchBox } from "react-instantsearch";
import { Button } from "@/components/ui/button";

const POPULAR_SEARCHES = [
  "Estonia Visa Fee",
  "Processing Time",
  "Book Appointment",
  "How many days",
  "Visa Fee",
];

export default function PopularSearches() {
  const { refine } = useSearchBox();

  return (
    <section aria-labelledby="popular-searches-heading" className="mb-8">
      <p
        className="mb-3 text-sm font-medium text-muted-foreground"
        id="popular-searches-heading"
      >
        Popular searches
      </p>
      <div className="flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((searchTerm) => (
          <Button
            key={searchTerm}
            onClick={() => refine(searchTerm)}
            type="button"
            variant="outline"
          >
            {searchTerm}
          </Button>
        ))}
      </div>
    </section>
  );
}
