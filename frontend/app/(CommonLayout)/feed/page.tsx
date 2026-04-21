import { LeftSidebar } from "@/components/feed/LeftSidebar";
import { MainFeed } from "@/components/feed/MainFeed";
import { RightSidebar } from "@/components/feed/RightSidebar";
import { getUser } from "@/services/auth.service";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default async function FeedPage() {
  const user = await getUser();
  
  return (
    <div className="w-full max-w-7xl mx-auto pt-6 pb-20 lg:pb-6 px-4 sm:px-6 lg:px-8">
      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Left Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-3">
          {/* ✅ FIX: Added fixed height and overflow-y-auto for independent scrolling */}
          <div className="sticky top-5 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar pb-6">
            {user ? (
              <LeftSidebar />
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                 <div className="flex items-center gap-3 mb-5">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                     <Building2 className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">Top Agencies</h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Discover premium partners</p>
                   </div>
                 </div>
                 
                 <div className="space-y-4 mb-5">
                   <div className="flex items-center gap-3 group cursor-pointer">
                     <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                       <img src="https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&q=80&w=100&h=100" alt="Agency" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Oceanic Adventures</p>
                       <p className="text-xs text-slate-500 font-medium truncate mt-0.5"><span className="text-amber-500">★ 4.9</span> • Maldives</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 group cursor-pointer">
                     <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                       <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=100&h=100" alt="Agency" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Alpine Explorers</p>
                       <p className="text-xs text-slate-500 font-medium truncate mt-0.5"><span className="text-amber-500">★ 4.8</span> • Switzerland</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 group cursor-pointer">
                     <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                       <img src="https://images.unsplash.com/photo-1542314831-c6a4d14effd0?auto=format&fit=crop&q=80&w=100&h=100" alt="Agency" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Safari Heights</p>
                       <p className="text-xs text-slate-500 font-medium truncate mt-0.5"><span className="text-amber-500">★ 4.7</span> • Kenya</p>
                     </div>
                   </div>
                 </div>

                 <Link href="/agencies">
                   <button className="w-full py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2 transition-all cursor-pointer">
                     See All Agencies
                     <ArrowRight className="w-4 h-4" />
                   </button>
                 </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Content (Scrollable naturally by the browser) */}
        <div className="col-span-1 lg:col-span-6">
          <MainFeed />
        </div>

        {/* Right Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-3">
          {/* ✅ FIX: Added fixed height and overflow-y-auto for independent scrolling */}
          <div className="sticky top-5 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar pb-6">
            <RightSidebar />
          </div>
        </div>

      </div>
    </div>
  );
}