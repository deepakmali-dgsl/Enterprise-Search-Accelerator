"use client";

import { useStats } from "react-instantsearch";

export default function ResultCount() {
  const { nbHits, processingTimeMS } = useStats();
  const resultLabel = nbHits === 1 ? "result" : "results";

  return (
    <p aria-live="polite" className="text-sm text-muted-foreground">
      {nbHits.toLocaleString()} {resultLabel} found
      {processingTimeMS ? ` in ${processingTimeMS}ms` : ""}
    </p>
  );
}
