import { UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { getUser, getSuggestedUsers } from "@/services/auth.service";
import { getFollowing } from "@/services/follow.service";
import { FollowButton } from "@/components/shared/FollowButton";

export async function RightSidebar() {
  const user = await getUser();
  const suggestedRaw = await getSuggestedUsers();

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

      {/* Trending Journeys */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Trending Journeys</h3>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Adventure</p>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Icelandic Ring Road Solo Tour</h4>
            <p className="text-xs text-slate-500 mt-1">4.2k travelers planning</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Culture</p>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Kyoto Temple Trail Guide</h4>
            <p className="text-xs text-slate-500 mt-1">2.8k travelers planning</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Relaxation</p>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Bali Hidden Retreats 2024</h4>
            <p className="text-xs text-slate-500 mt-1">1.9k travelers planning</p>
          </div>
        </div>
      </div>

      {/* Fellow Explorers / Suggested For You */}
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