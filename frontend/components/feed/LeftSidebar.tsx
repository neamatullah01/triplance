import Link from "next/link"
import {
  Home,
  Compass,
  Bookmark,
  Map,
  Settings,
  CircleUser,
  Telescope,
} from "lucide-react"
import { getUser } from "@/services/auth.service"
import { CreatePostModal } from "./CreatePostModal"

export async function LeftSidebar() {
  const user = await getUser()
  return (
    <div className="flex flex-col gap-6">
      {/* User Profile Snippet */}
      <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Link
          href="/feed/profile"
          className="group mb-5 flex cursor-pointer items-center gap-4"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 transition-colors group-hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <CircleUser className="h-full w-full stroke-1 text-slate-400" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="w-32 truncate text-base leading-tight font-bold text-indigo-900 transition-colors group-hover:text-indigo-600 dark:text-indigo-200 dark:group-hover:text-indigo-300">
              {user?.name || "User"}
            </h3>
            <p className="mt-0.5 w-32 truncate text-[13px] font-medium text-slate-500 dark:text-slate-400">
              {user?.bio ||
                (user?.role === "AGENCY" ? "Travel Agency" : "Global Explorer")}
            </p>
          </div>
        </Link>

        <div className="mb-5 h-px w-full bg-slate-100 dark:bg-slate-800"></div>

        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-indigo-900 dark:text-indigo-300">
              {user?._count?.posts || 0}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              Posts
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-indigo-900 dark:text-indigo-300">
              {user?._count?.followers || 0}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              Followers
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-indigo-900 dark:text-indigo-300">
              {user?._count?.following || 0}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              Following
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 pl-2">
        <Link
          href="/feed"
          className="flex items-center gap-4 rounded-xl bg-indigo-50 p-3 font-semibold text-indigo-700 transition-colors"
        >
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-4 rounded-xl p-3 font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Compass className="h-5 w-5" />
          Discover
        </Link>
        {/* <Link
          href="/saved"
          className="flex items-center gap-4 rounded-xl p-3 font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Bookmark className="h-5 w-5" />
          Saved
        </Link> */}
        <Link
          href="/explorers"
          className="flex items-center gap-4 rounded-xl p-3 font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Telescope className="h-5 w-5" />
          Explorers
        </Link>
        <Link
          href="/bookings"
          className="flex items-center gap-4 rounded-xl p-3 font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Map className="h-5 w-5" />
          Journeys
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-4 rounded-xl p-3 font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </nav>

      {/* Create posts Modal */}
      <div>
        <CreatePostModal />
      </div>
    </div>
  )
}
