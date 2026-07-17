import Link from "next/link";
import { ArrowLeft, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Details / placeholder page content shown after clicking a suggestion:
 * the selected country and, when the suggestion was a specific resource,
 * that resource's category and content snippet.
 */
export default function SearchResult({ country, category, snippet, recordType }) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Button
        className="mb-6"
        nativeButton={false}
        render={<Link href="/client-demo" />}
        size="sm"
        variant="ghost"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to search
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Globe2 aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <CardDescription>Country</CardDescription>
              <CardTitle className="text-2xl">{country}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {category ? (
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Selected Resource
              </p>
              <p className="mt-1 text-lg font-semibold">{category}</p>
              {snippet ? (
                <p className="mt-2 text-sm text-muted-foreground">{snippet}</p>
              ) : null}
            </div>
          ) : (
            <div>
              <Badge variant="secondary">Country overview</Badge>
              <p className="mt-3 text-sm text-muted-foreground">
                No specific resource was selected — this is the general
                overview page for {country}.
              </p>
            </div>
          )}

          {recordType === "resource" ? (
            <p className="text-xs text-muted-foreground">
              This is a demonstration page rendered from the Algolia record
              selected in search results. In a full integration it would
              deep-link to the live Contentful entry.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
