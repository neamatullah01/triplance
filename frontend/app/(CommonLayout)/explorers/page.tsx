"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, UserRoundPlus, UserCheck, MapPin, Star, Users, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { FollowButton } from "@/components/shared/FollowButton";
import { getUser } from "@/services/auth.service";
import { getFollowing } from "@/services/follow.service";

interface Explorer {
  id: string;
  name: string;
  email: string;
  role: "TRAVELER" | "AGENCY";
  profileImage: string | null;
  bio: string | null;
  rating: number;
  isVerified: boolean;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
}

export default function ExplorersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page") || "1");

  const [explorers, setExplorers] = useState<Explorer[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 12 });
  const [search, setSearch] = useState(initialSearch);
  const [inputValue, setInputValue] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const limit = 12;

  const fetchExplorers = useCallback(async (q: string, p: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...(q ? { searchTerm: q } : {}),
        page: String(p),
        limit: String(limit),
      });
      const res = await fetch(`/api/explorers?${params}`);
      const result = await res.json();
      if (result.success) {
        setExplorers(result.data || []);
        setMeta(result.meta || { total: 0, page: p, limit });
      }
    } catch (err) {
      console.error("Error fetching explorers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExplorers(search, page);
  }, [search, page, fetchExplorers]);

  // Load initial following list
  useEffect(() => {
    async function loadFollowing() {
      try {
        const user = await getUser();
        if (user?.id) {
          const followedUsers = await getFollowing(user.id);
          const followedIds = followedUsers.map((f: any) => f.followingId);
          setFollowing(new Set(followedIds));
        }
      } catch (err) {
        console.error("Error loading following interactions", err);
      }
    }
    loadFollowing();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
      // Sync URL params
      const params = new URLSearchParams();
      if (inputValue) params.set("search", inputValue);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFollowChange = (userId: string, isNowFollowing: boolean) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (isNowFollowing) next.add(userId);
      else next.delete(userId);
      return next;
    });

    // Optimistically update the follower count in the UI instantly
    setExplorers((prev) =>
      prev.map((exp) => {
        if (exp.id === userId) {
          const currentCount = exp._count?.followers ?? 0;
          return {
            ...exp,
            _count: {
              ...exp._count,
              followers: isNowFollowing ? currentCount + 1 : Math.max(0, currentCount - 1),
            },
          };
        }
        return exp;
      })
    );
  };

  const totalPages = Math.ceil(meta.total / limit);

  const getRoleLabel = (role: string) => {
    return role === "AGENCY" ? "Travel Agency" : "Explorer";
  };

  const getRoleColor = (role: string) => {
    return role === "AGENCY"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/feed" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                  Feed
                </Link>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">Fellow Explorers</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Fellow Explorers
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Discover travelers and agencies to follow and inspire your next journey.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{meta.total}</p>
                <p className="text-xs text-slate-500">Explorers</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, bio, or location..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all"
            />
            {inputValue && (
              <button
                onClick={() => setInputValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 text-sm">Finding explorers...</p>
          </div>
        ) : explorers.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Users className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No explorers found</h3>
            <p className="text-slate-500 text-sm text-center max-w-sm">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "No explorers available yet. Check back soon!"}
            </p>
            {search && (
              <button
                onClick={() => setInputValue("")}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Result count */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{explorers.length}</span> of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{meta.total}</span> explorers
              {search && (
                <> for "<span className="text-indigo-600 font-semibold">{search}</span>"</>
              )}
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {explorers.map((explorer) => {
                const isFollowing = following.has(explorer.id);
                return (
                  <Link
                    key={explorer.id}
                    href={`/explorers/${explorer.id}`}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col block"
                  >
                    {/* Card Banner */}
                    <div className="h-20 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 relative">
                      <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60')] bg-cover bg-center mix-blend-overlay" />
                    </div>

                    {/* Avatar */}
                    <div className="px-5 -mt-8 relative z-10">
                      <div className="w-16 h-16 rounded-2xl border-4 border-white dark:border-slate-900 overflow-hidden shadow-md bg-slate-200 dark:bg-slate-800">
                        {explorer.profileImage ? (
                          <img
                            src={explorer.profileImage}
                            alt={explorer.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                            {explorer.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-5 pt-3 pb-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {explorer.name}
                          </h3>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getRoleColor(explorer.role)}`}>
                            {getRoleLabel(explorer.role)}
                          </span>
                        </div>
                        {explorer.rating > 0 && (
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{explorer.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {explorer.bio && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
                          {explorer.bio}
                        </p>
                      )}

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 my-3 py-3 border-y border-slate-100 dark:border-slate-800">
                        <div className="text-center flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{explorer._count?.posts ?? 0}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Posts</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{explorer._count?.followers ?? 0}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Followers</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{explorer._count?.following ?? 0}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Following</p>
                        </div>
                      </div>

                      {/* Follow Button */}
                      <FollowButton 
                        targetUserId={explorer.id} 
                        initialIsFollowing={isFollowing} 
                        variant="full" 
                        targetUserName={explorer.name} 
                        onFollowChange={(st) => handleFollowChange(explorer.id, st)}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p as number)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            page === p
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
