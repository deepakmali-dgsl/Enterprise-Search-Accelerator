"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <div aria-busy="true" aria-label="Loading visa search results" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <Card aria-hidden="true" className="animate-pulse" key={index}>
          <CardHeader>
            <div className="h-5 w-2/5 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
