import { CircleUser } from "lucide-react";

export function RightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Suggested For You */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Suggested for You</h3>
        
        <div className="flex flex-col gap-4">
          {[
            { name: "Sarah Jenkins", type: "Backpacker" },
            { name: "Marco Rossi", type: "Foodie Traveler" },
            { name: "EcoStay", type: "Agency Spotlight" },
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CircleUser className="h-8 w-8 text-slate-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                  <p className="text-[11px] text-slate-500">{user.type}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-indigo-900 hover:text-indigo-700">Follow</button>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-5 text-xs font-semibold text-slate-500 hover:text-slate-800">
          Show More
        </button>
      </div>

      {/* Trending Journeys */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Trending Journeys</h3>
        
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Adventure</p>
            <h4 className="text-sm font-bold text-slate-900">Icelandic Ring Road Solo Tour</h4>
            <p className="text-xs text-slate-500 mt-1">4.2k travelers planning</p>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Culture</p>
            <h4 className="text-sm font-bold text-slate-900">Kyoto Temple Trail Guide</h4>
            <p className="text-xs text-slate-500 mt-1">2.8k travelers planning</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Relaxation</p>
            <h4 className="text-sm font-bold text-slate-900">Bali Hidden Retreats 2024</h4>
            <p className="text-xs text-slate-500 mt-1">1.9k travelers planning</p>
          </div>
        </div>
      </div>

    </div>
  );
}