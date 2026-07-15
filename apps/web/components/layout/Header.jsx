import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2">
            <Search className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Enterprise Search Accelerator
            </h1>

            <p className="text-sm text-slate-500">
              Contentful • Algolia • Next.js
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}