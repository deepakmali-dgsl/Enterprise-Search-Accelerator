import SearchClient from "@/components/search/SearchClient";

export default async function SearchPage({ searchParams }) {
  const { query = "" } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold">Enterprise Search</h1>
      <SearchClient initialQuery={query} />
    </main>
  );
}
