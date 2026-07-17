import Header from "@/components/layout/Header";
import SearchResult from "@/components/client-demo/SearchResult";

export default async function ClientDemoResourcePage({ searchParams }) {
  const { country = "", category = "", snippet = "", recordType = "" } =
    await searchParams;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SearchResult
          category={category}
          country={country}
          recordType={recordType}
          snippet={snippet}
        />
      </main>
    </>
  );
}
