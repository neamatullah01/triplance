import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, SearchX } from "lucide-react";
import { PackageList } from "@/components/explore/PackageList";
import { SearchBar } from "@/components/explore/SearchBar";
import { getPackages } from "@/services/package.service";

export const metadata = {
  title: "Explore Packages | Triplance",
  description: "Find your next adventure with our curated travel packages.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; destination?: string }>;
}) {
  const { page, destination } = await searchParams;
  const currentPage = Number(page) || 1;
  const result = await getPackages(currentPage, 10, destination);

  const meta = result?.meta || { page: 1, limit: 10, total: 0 };
  const data = result?.data || [];
  
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Hero Cover Section */}
      <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80" 
            alt="Explore Destinations" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-center text-center gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-3">
              Find Your Next Adventure
            </h1>
            <p className="text-lg md:text-xl font-medium text-slate-100 max-w-2xl drop-shadow-md">
              Explore top-rated travel packages curated by trusted agencies worldwide.
            </p>
          </div>
          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        
        <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {destination ? `Results for "${destination}"` : "Popular Packages"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {meta.total > 0
                ? `Showing ${meta.total} inspiring ${meta.total === 1 ? "journey" : "journeys"}`
                : "No packages found"}
            </p>
          </div>
          {destination && (
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              {destination}
              <span className="ml-1 text-indigo-400">✕</span>
            </Link>
          )}
        </div>

        {/* Client Component for animated rendering */}
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
              <SearchX className="h-9 w-9 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              No packages found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              {destination
                ? `We couldn't find any packages for "${destination}". Try a different destination.`
                : "No packages are available right now. Check back soon!"}
            </p>
            {destination && (
              <Link
                href="/explore"
                className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-600/20"
              >
                Clear Search
              </Link>
            )}
          </div>
        ) : (
          <PackageList packages={data} />
        )}

        {/* Server-Side Pagination using URLs */}
        {totalPages > 1 && (() => {
          const buildHref = (p: number) => {
            const params = new URLSearchParams();
            params.set("page", String(p));
            if (destination) params.set("destination", destination);
            return `/explore?${params.toString()}`;
          };
          return (
            <div className="flex items-center justify-center gap-2 mt-12">

              {/* Prev Button */}
              {currentPage > 1 ? (
                <Link
                  href={buildHref(currentPage - 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              ) : (
                <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed">
                  <ChevronLeft className="h-5 w-5" />
                </div>
              )}

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <Link
                      key={pageNum}
                      href={buildHref(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {/* Next Button */}
              {currentPage < totalPages ? (
                <Link
                  href={buildHref(currentPage + 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              ) : (
                <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}

            </div>
          );
        })()}

      </div>
    </div>
  );
}