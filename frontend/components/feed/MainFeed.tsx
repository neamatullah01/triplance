import { MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, CheckCircle2 } from "lucide-react";

export function MainFeed() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Filter Chips (Scrollable horizontally on mobile) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-5 py-2 bg-indigo-700 text-white text-sm font-medium rounded-full whitespace-nowrap">
          All Posts
        </button>
        <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors">
          Top Experiences
        </button>
        <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors">
          Local Guides
        </button>
        <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors">
          Photography
        </button>
      </div>

      {/* Post 1: Standard User Post */}
      <article className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden">
              {/* Profile Image Placeholder */}
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="User" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Julian Rivers</h4>
              <p className="text-xs text-slate-500">2 hours ago • Amalfi Coast, Italy</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-5 w-5" /></button>
        </div>
        
        <p className="text-slate-700 text-sm leading-relaxed mb-4">
          Found a hidden cove just past the main square in Positano. The water is impossibly clear this time of year. A moment of pure silence in the middle of a bustling coastal dream.
        </p>

        <div className="w-full h-64 sm:h-80 bg-slate-100 rounded-2xl mb-4 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80" alt="Amalfi Coast" className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors">
              <Heart className="h-5 w-5" /> <span className="text-sm font-medium">2.4k</span>
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <MessageCircle className="h-5 w-5" /> <span className="text-sm font-medium">128</span>
            </button>
            <button className="text-slate-500 hover:text-indigo-600 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <button className="text-slate-500 hover:text-indigo-900 transition-colors">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </article>

      {/* Post 2: Agency Sponsored Post */}
      <article className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-900 text-white flex items-center justify-center rounded-full font-bold">N</div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-bold text-slate-900">Nomad Expeditions</h4>
                <CheckCircle2 className="h-4 w-4 text-blue-500" fill="currentColor" />
              </div>
              <p className="text-xs text-slate-500">Agency Spotlight • Sponsored</p>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-indigo-900 text-white text-xs font-semibold rounded-full hover:bg-indigo-800 transition-colors">
            Follow
          </button>
        </div>

        {/* Custom Image Grid layout */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-40 bg-slate-100 rounded-xl overflow-hidden">
             <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" className="w-full h-full object-cover" alt="Trekking" />
          </div>
          <div className="h-40 bg-slate-100 rounded-xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&q=80" className="w-full h-full object-cover" alt="Camping" />
          </div>
          <div className="col-span-2 h-48 bg-slate-100 rounded-xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" className="w-full h-full object-cover" alt="Mountains" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">The Patagonia Circuit: Fall 2024</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          Join us for an exclusive 14-day trekking journey through the heart of the Andes. Experience Torres del Paine like never before with expert local guides and sustainable camping practices.
        </p>

        <button className="w-full py-3 bg-rose-800 hover:bg-rose-900 text-white font-medium rounded-xl transition-colors text-sm">
          View Expedition Details
        </button>
      </article>

    </div>
  );
}