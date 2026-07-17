import Header from "@/components/layout/Header";
import ClientDemoSearch from "@/components/client-demo/ClientDemoSearch";

export default function ClientDemoPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Client Content Demo
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Search across the client&apos;s Country and Resource Group content
            model. Try a country name, a resource like{" "}
            <span className="font-medium text-foreground">Visa</span>, or
            both together.
          </p>
        </div>

        <ClientDemoSearch />
      </main>
    </>
  );
}
