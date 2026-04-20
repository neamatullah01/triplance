"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";

/** Build a clean /explore?... URL without URLSearchParams encoding quirks. */
function buildExploreUrl(destination: string, page: number = 1) {
  const parts: string[] = [`page=${page}`];
  if (destination.trim()) {
    // encodeURIComponent encodes spaces as %20 and ' as %27 — standard and backend-friendly
    parts.push(`destination=${encodeURIComponent(destination.trim())}`);
  }
  return `/explore?${parts.join("&")}`;
}

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("destination") ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(buildExploreUrl(query));
    });
  };

  const handleClear = () => {
    setQuery("");
    startTransition(() => {
      router.push("/explore?page=1");
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center group">

        {/* Left search icon */}
        <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10">
          <Search className="h-5 w-5" />
        </div>

        {/* Input — right padding accounts for both buttons */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by destination (e.g. Cox's Bazar, Sylhet...)"
          className="
            w-full pl-12 py-4
            bg-white/95 dark:bg-slate-900/95
            backdrop-blur-md
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            rounded-2xl
            border border-slate-200 dark:border-slate-700
            shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
            outline-none
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200
            text-sm font-medium
          "
          style={{ paddingRight: query ? "7.5rem" : "6rem" }}
        />

        {/* Right-side button group — always together, never overlapping */}
        <div className="absolute right-2 flex items-center gap-1">
          {/* Clear button — only visible when there's a query */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="
                p-1.5 rounded-lg
                text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-all duration-150
              "
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="
              px-4 py-2.5
              bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
              text-white text-sm font-bold
              rounded-xl
              shadow-md shadow-indigo-600/30
              transition-all duration-200
              cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center gap-2
              whitespace-nowrap
            "
          >
            {isPending ? (
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </div>

      </div>
    </form>
  );
}
