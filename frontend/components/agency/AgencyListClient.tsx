"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"
import {
  Search,
  Star,
  Users,
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { FollowButton } from "@/components/shared/FollowButton"

// --- Types ---
interface Agency {
  id: string
  name: string
  bio: string
  profileImage: string | null
  coverImage: string | null
  rating: number
  followersCount: number
  isVerified: boolean
  isFollowed?: boolean
}

interface Meta {
  page: number
  limit: number
  total: number
}

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function AgencyListClient({
  agencies,
  meta,
  initialSearch,
}: {
  agencies: Agency[]
  meta: Meta
  initialSearch: string
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({})

  const totalPages = Math.ceil(meta.total / meta.limit) || 1

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/agency?q=${encodeURIComponent(searchQuery)}&page=1`)
  }

  const handleFollowChange = (agencyId: string, isFollowing: boolean) => {
    setFollowingMap((prev) => ({ ...prev, [agencyId]: isFollowing }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header & Search Bar */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
            All Agencies and Tour Groups
          </h1>
          <p className="font-medium text-slate-500 dark:text-slate-400">
            Discover and follow top-rated travel organizers for your next trip.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
          <button type="submit" className="hidden">
            Search
          </button>
        </form>
      </div>

      {/* Grid List */}
      {agencies.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            No agencies found
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {agencies.map((agency) => {
            const isFollowing =
              followingMap[agency.id] !== undefined
                ? followingMap[agency.id]
                : agency.isFollowed || false

            let displayFollowersCount = agency.followersCount || 0
            if (agency.isFollowed && !isFollowing) {
              displayFollowersCount = Math.max(0, displayFollowersCount - 1)
            } else if (!agency.isFollowed && isFollowing) {
              displayFollowersCount += 1
            }

            return (
              <motion.div key={agency.id} variants={cardVariants}>
                <Link
                  href={`/agency/${agency.id}`}
                  className="group block h-full"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900/50">
                    {/* Top Banner Cover */}
                    <div className="relative h-24 w-full bg-slate-100 dark:bg-slate-800">
                      {agency.coverImage ? (
                        <img
                          src={agency.coverImage}
                          alt="Cover"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80" />
                      )}
                    </div>

                    <div className="relative flex flex-1 flex-col px-5 pb-5">
                      {/* Avatar Overlapping Banner */}
                      <div className="-mt-10 mb-3 flex items-start justify-between">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-sm dark:border-slate-900 dark:bg-slate-800">
                          {agency.profileImage ? (
                            <img
                              src={agency.profileImage}
                              alt={agency.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-2xl font-bold text-indigo-600">
                              {agency.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Action Follow Button (Top Right) */}
                        <div
                          onClick={(e) => e.preventDefault()}
                          className="relative z-10 mt-12"
                        >
                          <FollowButton
                            targetUserId={agency.id}
                            targetUserName={agency.name}
                            initialIsFollowing={agency.isFollowed}
                            onFollowChange={(status) =>
                              handleFollowChange(agency.id, status)
                            }
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="flex items-center gap-1.5 truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                          {agency.name}
                          {agency.isVerified && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 fill-blue-50 text-blue-500" />
                          )}
                        </h3>
                        <p className="mt-1 flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />{" "}
                            {agency.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-slate-400" />{" "}
                            {displayFollowersCount} followers
                          </span>
                        </p>
                      </div>

                      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {agency.bio}
                      </p>

                      {/* View Details Link Footer */}
                      <div className="mt-5 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          View Agency Profile
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Pagination - ONLY SHOWS IF MORE THAN 1 PAGE (i.e., Total > 20) */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {meta.page > 1 ? (
            <Link
              href={`/agency?q=${encodeURIComponent(searchQuery)}&page=${meta.page - 1}`}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <div className="cursor-not-allowed rounded-xl border border-slate-200 p-2 text-slate-300 opacity-50 dark:border-slate-800 dark:text-slate-700">
              <ChevronLeft className="h-5 w-5" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              const isActive = meta.page === pageNum
              return (
                <Link
                  key={pageNum}
                  href={`/agency?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
          </div>

          {meta.page < totalPages ? (
            <Link
              href={`/agency?q=${encodeURIComponent(searchQuery)}&page=${meta.page + 1}`}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <div className="cursor-not-allowed rounded-xl border border-slate-200 p-2 text-slate-300 opacity-50 dark:border-slate-800 dark:text-slate-700">
              <ChevronRight className="h-5 w-5" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
