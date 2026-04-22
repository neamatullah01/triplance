"use client";

import { useState } from "react";
import { Search, Trash2, Eye, Heart, MessageCircle, Flag } from "lucide-react";

const postsData = [
  { id: 1, author: "Sarah Jenkins",    role: "traveler", content: "Found a hidden cove just past Positano. The water is impossibly clear...",        likes: 2400, comments: 128, reported: false, date: "Apr 6, 2026" },
  { id: 2, author: "Nomad Expeditions",role: "agency",   content: "Join us for an exclusive 14-day trekking journey through the Andes...",            likes: 890,  comments: 45,  reported: false, date: "Apr 5, 2026" },
  { id: 3, author: "Marco Rossi",      role: "traveler", content: "Just finished the Kyoto Temple Trail. Absolutely breathtaking...",                 likes: 1200, comments: 67,  reported: false, date: "Apr 4, 2026" },
  { id: 4, author: "Unknown User",     role: "traveler", content: "SPAM: Buy cheap travel packages at sketchy-link.com...",                           likes: 2,    comments: 0,   reported: true,  date: "Apr 3, 2026" },
  { id: 5, author: "Amira Khan",       role: "traveler", content: "Bali retreat was a life-changing experience. 10/10 recommend...",                  likes: 3100, comments: 201, reported: false, date: "Apr 2, 2026" },
  { id: 6, author: "FakeAgency",       role: "agency",   content: "We offer GUARANTEED visa approvals. Contact us now for ...",                       likes: 5,    comments: 3,   reported: true,  date: "Apr 1, 2026" },
];

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    traveler: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    agency:   "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[role] || ""}`}>{role}</span>;
}

export default function PostsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = postsData.filter((p) => filter === "all" ? true : (filter === "reported" ? p.reported : true));
  const reportedCount = postsData.filter((p) => p.reported).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Content Moderation</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review and moderate posts across the platform</p>
        </div>
        {reportedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl self-start sm:self-auto shrink-0">
            <Flag className="h-4 w-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">{reportedCount} reported posts</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          {["all", "reported"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
              {f === "reported" ? "⚠ Reported" : f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search posts..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 sm:px-6 py-3">Author</th>
                <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Content</th>
                <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Engagement</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className={`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${post.reported ? "bg-red-50/50 dark:bg-red-950/10" : ""}`}>
                  <td className="px-4 sm:px-6 py-3.5">
                    <p className="font-semibold text-slate-900 dark:text-white">{post.author}</p>
                    <RoleBadge role={post.role} />
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 max-w-xs hidden md:table-cell">
                    <p className="text-slate-700 dark:text-slate-300 truncate">{post.content}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 hidden sm:table-cell">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.comments}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    {post.reported ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"><Flag className="h-3 w-3" /> Reported</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Clean</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{post.date}</td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
