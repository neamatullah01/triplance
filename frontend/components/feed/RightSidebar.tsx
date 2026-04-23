import { UserRoundPlus, Radar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getUser, getSuggestedUsers } from "@/services/auth.service"
import { getFollowing } from "@/services/follow.service"
import { getPackages } from "@/services/package.service"
import { FollowButton } from "@/components/shared/FollowButton"

export async function RightSidebar() {
  const user = await getUser()
  const suggestedRaw = await getSuggestedUsers()

  // Fetch packages for the Trending section
  const packagesRes = await getPackages(1, 4)
  const recentPackages = packagesRes?.data || []

  let followingIds = new Set<string>()
  if (user?.id) {
    try {
      const followed = await getFollowing(user.id)
      followingIds = new Set(followed.map((f: any) => f.followingId))
    } catch (err) {
      console.error("Error loading following in RightSidebar", err)
    }
  }

  // Filter out the logged-in user AND already followed users, then slice the top 3
  const suggested = Array.isArray(suggestedRaw)
    ? suggestedRaw
        .filter((u: any) => u.id !== user?.id && !followingIds.has(u.id))
        .slice(0, 3)
    : []

  return (
    <div className="flex flex-col gap-6">
      {/* --- NEW COMPACT TRENDING JOURNEYS --- */}
      <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Subtle background glow effect */}
        <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-700 group-hover:bg-indigo-500/20 dark:bg-indigo-500/20"></div>

        {/* Header with animated Radar Icon & Explore Arrow */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-black text-indigo-950 dark:text-indigo-100">
            Trending Journeys
          </h3>
          <div className="flex items-center gap-2">
            {/* The Ping Animation Circle */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-25"></span>
              <Radar className="relative z-10 h-4 w-4" />
            </div>
            {/* Explore Arrow Button */}
            <Link
              href="/explore"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400"
              title="Explore All Packages"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stacked Image Cards (Compact) */}
        <div className="flex flex-col gap-3">
          {recentPackages.length > 0 ? (
            recentPackages.slice(0, 3).map((pkg: any) => (
              <Link
                href={`/explore/${pkg.id}`}
                key={pkg.id}
                className="group/card relative block h-20 w-full overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Background Image */}
                {pkg.images?.[0] ? (
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-800" />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover/card:bg-black/50" />

                {/* Centered Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-2 text-center">
                  {/* Extract just the first part of the destination (e.g., "Dubai" from "Dubai, UAE") */}
                  <h4 className="text-base font-bold text-white drop-shadow-lg">
                    {pkg.destination
                      ? pkg.destination.split(",")[0]
                      : "Destination"}
                  </h4>
                  {/* Subtitle using the package title, widely spaced and uppercase */}
                  <p className="mt-0.5 line-clamp-1 text-[8px] font-bold tracking-[0.2em] text-white/90 uppercase drop-shadow-md">
                    {pkg.title}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-slate-500">
              No trending packages yet.
            </p>
          )}
        </div>
      </div>

      {/* --- FELLOW EXPLORERS --- */}
      {suggested.length > 0 && (
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Fellow Explorers
            </h3>
            <Link
              href="/explorers"
              className="text-xs font-bold tracking-wide text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              VIEW ALL
            </Link>
          </div>

          {/* User List */}
          <div className="flex flex-col gap-4">
            {suggested.map((suggestedUser: any) => (
              <div
                key={suggestedUser.id}
                className="group flex items-center justify-between gap-2"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Avatar */}
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 shadow-sm dark:border-slate-700">
                    {suggestedUser.profileImage ? (
                      <img
                        src={suggestedUser.profileImage}
                        alt={suggestedUser.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
                        {suggestedUser.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name + Sub */}
                  <div className="min-w-0">
                    <h4 className="cursor-pointer truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                      {suggestedUser.name}
                    </h4>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {suggestedUser.bio ||
                        (suggestedUser.role === "AGENCY"
                          ? "Travel Agency"
                          : "Explorer")}
                    </p>
                  </div>
                </div>

                {/* Follow Button */}
                <FollowButton
                  targetUserId={suggestedUser.id}
                  initialIsFollowing={followingIds.has(suggestedUser.id)}
                  variant="pill"
                  targetUserName={suggestedUser.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3 px-2">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link
            href="/about"
            className="transition-colors hover:text-slate-800 hover:underline dark:hover:text-slate-200"
          >
            About
          </Link>
          <Link
            href="/help"
            className="transition-colors hover:text-slate-800 hover:underline dark:hover:text-slate-200"
          >
            Help Center
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-slate-800 hover:underline dark:hover:text-slate-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-slate-800 hover:underline dark:hover:text-slate-200"
          >
            Terms of Service
          </Link>
        </nav>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} TripLance Bangladesh
        </p>
      </div>
    </div>
  )
}
