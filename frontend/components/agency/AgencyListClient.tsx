"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Search, Star, Users, CheckCircle2, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { FollowButton } from "@/components/shared/FollowButton";

// --- Types ---
interface Agency {
  id: string;
  name: string;
  bio: string;
  profileImage: string | null;
  coverImage: string | null;
  rating: number;
  followersCount: number;
  isVerified: boolean;
  isFollowed?: boolean;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function AgencyListClient({ 
  agencies, 
  meta, 
  initialSearch 
}: { 
  agencies: Agency[]; 
  meta: Meta;
  initialSearch: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/agency?q=${encodeURIComponent(searchQuery)}&page=1`);
  };

  const handleFollowChange = (agencyId: string, isFollowing: boolean) => {
    setFollowingMap(prev => ({ ...prev, [agencyId]: isFollowing }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
            All Agencies and Tour Groups
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Discover and follow top-rated travel organizers for your next trip.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-80 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search agencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition-all"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      {/* Grid List */}
      {agencies.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
          <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No agencies found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search terms.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {agencies.map((agency) => {
            const isFollowing = followingMap[agency.id] !== undefined 
              ? followingMap[agency.id] 
              : (agency.isFollowed || false);

            let displayFollowersCount = agency.followersCount || 0;
            if (agency.isFollowed && !isFollowing) {
              displayFollowersCount = Math.max(0, displayFollowersCount - 1);
            } else if (!agency.isFollowed && isFollowing) {
              displayFollowersCount += 1;
            }
            
            return (
              <motion.div key={agency.id} variants={cardVariants}>
                <Link href={`/agency/${agency.id}`} className="block h-full group">
                  <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300">
                    
                    {/* Top Banner Cover */}
                    <div className="h-24 w-full relative bg-slate-100 dark:bg-slate-800">
                      {agency.coverImage ? (
                        <img src={agency.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80" />
                      )}
                    </div>

                    <div className="px-5 pb-5 flex flex-col flex-1 relative">
                      {/* Avatar Overlapping Banner */}
                      <div className="flex justify-between items-start -mt-10 mb-3">
                        <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm">
                          {agency.profileImage ? (
                            <img src={agency.profileImage} alt={agency.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-2xl">
                              {agency.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Follow Button (Top Right) */}
                        <div onClick={(e) => e.preventDefault()} className="mt-12 relative z-10">
                          <FollowButton 
                            targetUserId={agency.id} 
                            targetUserName={agency.name} 
                            initialIsFollowing={agency.isFollowed} 
                            onFollowChange={(status) => handleFollowChange(agency.id, status)} 
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5 truncate">
                          {agency.name}
                          {agency.isVerified && <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-50 shrink-0" />}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" /> {agency.rating}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-slate-400" /> {displayFollowersCount} followers</span>
                        </p>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 line-clamp-2 leading-relaxed flex-1">
                        {agency.bio}
                      </p>

                      {/* View Details Link Footer */}
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">View Agency Profile</span>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination - ONLY SHOWS IF MORE THAN 1 PAGE (i.e., Total > 20) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {meta.page > 1 ? (
            <Link 
              href={`/agency?q=${encodeURIComponent(searchQuery)}&page=${meta.page - 1}`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed">
              <ChevronLeft className="h-5 w-5" />
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = meta.page === pageNum;
              return (
                <Link
                  key={pageNum}
                  href={`/agency?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`}
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

          {meta.page < totalPages ? (
            <Link 
              href={`/agency?q=${encodeURIComponent(searchQuery)}&page=${meta.page + 1}`}
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
      )}
    </div>
  );
}