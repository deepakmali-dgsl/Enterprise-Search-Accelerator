import SearchClient from "@/components/search/SearchClient";

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl p-10">

      <h1 className="mb-8 text-4xl font-bold">
        Enterprise Search
      </h1>

      <SearchClient />

    </main>
  );
}