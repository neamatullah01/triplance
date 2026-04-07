import Link from "next/link";
import { Home, Compass, Bookmark, Map, Settings, Plus, CircleUser } from "lucide-react";

export function LeftSidebar() {
  return (
    <div className="flex flex-col gap-6">
      {/* User Profile Snippet */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <CircleUser className="h-12 w-12 text-slate-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Neamat Ullah</h3>
          <p className="text-xs text-slate-500">Elite Explorer</p>
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

      {/* Create Story Button */}
      <button className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-medium rounded-2xl transition-colors shadow-sm">
        <Plus className="h-5 w-5" />
        Create Post
      </button>
    </div>
  );
}