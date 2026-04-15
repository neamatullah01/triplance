import Link from "next/link";
import { Home, Compass, Bookmark, Map, Settings, CircleUser } from "lucide-react";
import { getUser } from "@/services/auth.service";
import { CreatePostModal } from "./CreatePostModal";

export async function LeftSidebar() {
  const user = await getUser();
  return (
    <div className="flex flex-col gap-6">
      {/* User Profile Snippet */}
      <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <CircleUser className="h-full w-full stroke-1 text-slate-400" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-200 leading-tight truncate w-32">
              {user?.name || "User"}
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate w-32">
              {user?.bio || (user?.role === "AGENCY" ? "Travel Agency" : "Global Explorer")}
            </p>
          </div>
        </div>
        
        <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-5"></div>
        
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-indigo-900 dark:text-indigo-300">
              {user?._count?.posts || 0}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mt-1">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-indigo-900 dark:text-indigo-300">
              {user?._count?.followers || 0}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mt-1">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-indigo-900 dark:text-indigo-300">
              {user?._count?.following || 0}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mt-1">Following</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 pl-2">
        <Link href="/feed" className="flex items-center gap-4 p-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold transition-colors">
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link href="/discover" className="flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
          <Compass className="h-5 w-5" />
          Discover
        </Link>
        <Link href="/saved" className="flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
          <Bookmark className="h-5 w-5" />
          Saved
        </Link>
        <Link href="/journeys" className="flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
          <Map className="h-5 w-5" />
          Journeys
        </Link>
        <Link href="/settings" className="flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </nav>

      {/* Create posts Modal */}
      <div>
        <CreatePostModal />
      </div>
    </div>
  );
}