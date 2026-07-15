"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, Globe } from "lucide-react";

export default function VisaCard({ hit }) {
  return (
    <Card className="mb-6 rounded-2xl shadow-sm">
      <CardContent className="p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              🌍 {hit.country}
            </h2>

            <p className="text-slate-500">
              Apply from {hit.applyFrom}
            </p>

          </div>

        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">

          <div className="flex items-center gap-3">
            <CreditCard className="text-blue-600" />

            <div>
              <p className="text-sm text-slate-500">
                Visa Fee
              </p>

              <p className="font-semibold">
                {hit.currency} {hit.visaFee}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-green-600" />

            <div>
              <p className="text-sm text-slate-500">
                Processing Time
              </p>

              <p className="font-semibold">
                {hit.processingTime}
              </p>
            </div>
          </div>

        </div>

        <Button className="mt-8">
          Book Appointment
        </Button>

      </CardContent>
    </Card>
  );
}