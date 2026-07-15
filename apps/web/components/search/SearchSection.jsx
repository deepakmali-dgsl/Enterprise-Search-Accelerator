"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchSection() {
  return (
    <section className="mx-auto mt-16 max-w-4xl">

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <h3 className="mb-6 text-2xl font-semibold">

          Search Visa Information

        </h3>

        <div className="flex gap-4">

          <Input
            placeholder="Try: Estonia Visa Fee"
            className="h-12"
          />

          <Button className="h-12 px-8">

            <Search className="mr-2 h-4 w-4" />

            Search

          </Button>

        </div>

      </div>

    </section>
  );
}