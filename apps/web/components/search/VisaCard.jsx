"use client";

import { CalendarDays, Clock3, CreditCard, FileText, Globe2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatVisaFee(visaFee, currency) {
  try {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
      style: "currency",
      currency: currency || "USD",
    }).format(visaFee || 0);
  } catch {
    return `${currency || ""} ${visaFee || 0}`.trim();
  }
}

export default function VisaCard({ hit }) {
  return (
    <Card className="h-full justify-between transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Globe2 aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">{hit.country}</CardTitle>
            <CardDescription>Apply from {hit.applyFrom}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <div className="flex items-center gap-3">
          <CreditCard aria-hidden="true" className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Visa fee
            </p>
            <p className="font-semibold">
              {formatVisaFee(hit.visaFee, hit.currency)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 aria-hidden="true" className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Processing time
            </p>
            <p className="font-semibold">{hit.processingTime}</p>
          </div>
        </div>

        {hit.pdfUrl ? (
          <div className="flex items-center gap-3 sm:col-span-2 xl:col-span-1">
            <FileText aria-hidden="true" className="h-5 w-5 text-primary" />
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                PDF document
              </p>
              <a
                className="block truncate text-sm font-medium text-primary underline-offset-4 hover:underline"
                href={hit.pdfUrl}
                rel="noreferrer"
                target="_blank"
              >
                {hit.pdfUrl}
              </a>
            </div>
          </div>
        ) : null}
      </CardContent>

      <CardFooter>
        {hit.appointmentUrl ? (
          <Button
            className="w-full"
            nativeButton={false}
            render={<a href={hit.appointmentUrl} />}
          >
            <CalendarDays aria-hidden="true" />
            Book appointment
          </Button>
        ) : (
          <Button className="w-full" disabled>
            <CalendarDays aria-hidden="true" />
            Book appointment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
