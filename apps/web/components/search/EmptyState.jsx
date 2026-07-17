"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState({ query, onClear }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <SearchX aria-hidden="true" className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">No visa information found</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {query
            ? `We could not find results for “${query}”. Try a different search term.`
            : "Try searching by country, visa fee, or processing time."}
        </p>
        {query ? (
          <Button className="mt-5" onClick={onClear} type="button" variant="outline">
            Clear search
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
