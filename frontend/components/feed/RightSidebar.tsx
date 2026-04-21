import { UserRoundPlus, Radar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUser, getSuggestedUsers } from "@/services/auth.service";
import { getFollowing } from "@/services/follow.service";
import { getPackages } from "@/services/package.service";
import { FollowButton } from "@/components/shared/FollowButton";

export async function RightSidebar() {
  const user = await getUser();
  const suggestedRaw = await getSuggestedUsers();
  
  // Fetch packages for the Trending section
  const packagesRes = await getPackages(1, 4);
  const recentPackages = packagesRes?.data || [];

  let followingIds = new Set<string>();
  if (user?.id) {
    try {
      const followed = await getFollowing(user.id);
      followingIds = new Set(followed.map((f: any) => f.followingId));
    } catch (err) {
      console.error("Error loading following in RightSidebar", err);
    }
  }

  // Filter out the logged-in user AND already followed users, then slice the top 3
  const suggested = Array.isArray(suggestedRaw)
    ? suggestedRaw
        .filter((u: any) => u.id !== user?.id && !followingIds.has(u.id))
        .slice(0, 3)
    : [];

  return (
    <div className="flex flex-col gap-6">

      {/* --- NEW COMPACT TRENDING JOURNEYS --- */}
      <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        
        {/* Subtle background glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl -z-10 rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>

        {/* Header with animated Radar Icon & Explore Arrow */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-indigo-950 dark:text-indigo-100">
            Trending Journeys
          </h3>
          <div className="flex items-center gap-2">
            {/* The Ping Animation Circle */}
            <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-25 animate-ping"></span>
              <Radar className="h-4 w-4 relative z-10" />
            </div>
            {/* Explore Arrow Button */}
            <Link 
              href="/explore" 
              className="flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors shadow-sm border border-slate-100 dark:border-slate-700"
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
                className="relative block h-20 w-full rounded-2xl overflow-hidden group/card shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Background Image */}
                {pkg.images?.[0] ? (
                  <img 
                    src={pkg.images[0]} 
                    alt={pkg.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-800" />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/50 transition-colors duration-300" />

                {/* Centered Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-2">
                  {/* Extract just the first part of the destination (e.g., "Dubai" from "Dubai, UAE") */}
                  <h4 className="text-white font-bold text-base drop-shadow-lg">
                    {pkg.destination ? pkg.destination.split(',')[0] : 'Destination'}
                  </h4>
                  {/* Subtitle using the package title, widely spaced and uppercase */}
                  <p className="text-white/90 text-[8px] font-bold tracking-[0.2em] uppercase mt-0.5 drop-shadow-md line-clamp-1">
                    {pkg.title}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">No trending packages yet.</p>
          )}
        </div>
      </div>

      {/* --- FELLOW EXPLORERS --- */}
      {suggested.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Fellow Explorers</h3>
            <Link href="/explorers" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 tracking-wide transition-colors">
              VIEW ALL
            </Link>
          </div>

          {/* User List */}
          <div className="flex flex-col gap-4">
            {suggested.map((suggestedUser: any) => (
              <div key={suggestedUser.id} className="flex items-center justify-between group gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700 shrink-0 shadow-sm">
                    {suggestedUser.profileImage ? (
                      <img
                        src={suggestedUser.profileImage}
                        alt={suggestedUser.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {suggestedUser.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name + Sub */}
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer">
                      {suggestedUser.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {suggestedUser.bio || (suggestedUser.role === "AGENCY" ? "Travel Agency" : "Explorer")}
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

    </div>
  );
}