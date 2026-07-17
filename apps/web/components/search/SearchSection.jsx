"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submitSearch(event) {
    event.preventDefault();
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="mx-auto mt-16 max-w-4xl">

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <h3 className="mb-6 text-2xl font-semibold">

          Search Visa Information

        </h3>

        <form className="flex flex-col gap-4 sm:flex-row" onSubmit={submitSearch}>

          <Input
            placeholder="Try: Estonia Visa Fee"
            className="h-12"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
          />

          <Button className="h-12 px-8" type="submit">

            <Search className="mr-2 h-4 w-4" />

            Search

          </Button>

        </form>

      </div>

    </section>
  );
}
