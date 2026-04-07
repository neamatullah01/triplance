"use client";

import { useState } from "react";
import { Search, Trash2, Eye, Star, Flag } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const reviewsData = [
  { id: 1, author: "Sarah Jenkins", package: "Patagonia Circuit", agency: "Nomad Expeditions", rating: 5, comment: "Absolutely life-changing trip! The guides were incredible.", reported: false, date: "Apr 5, 2026" },
  { id: 2, author: "Marco Rossi", package: "Kyoto Temple Trail", agency: "Wanderlust Co.", rating: 4, comment: "Great experience, but the accommodations could be better.", reported: false, date: "Apr 4, 2026" },
  { id: 3, author: "Amira Khan", package: "Bali Hidden Retreats", agency: "AquaVenture Tours", rating: 5, comment: "Perfect retreat. Every detail was thoughtfully planned.", reported: false, date: "Apr 3, 2026" },
  { id: 4, author: "Julian Rivers", package: "Iceland Ring Road", agency: "Nomad Expeditions", rating: 1, comment: "FAKE REVIEW - Never actually went on this trip!", reported: true, date: "Apr 2, 2026" },
  { id: 5, author: "Priya Sharma", package: "Swiss Alps Trek", agency: "Wanderlust Co.", rating: 4, comment: "Beautiful scenery and well-organized trip. Would recommend.", reported: false, date: "Apr 1, 2026" },
  { id: 6, author: "Unknown", package: "Morocco Desert Tour", agency: "Sahara Expeditions", rating: 1, comment: "This is a competing agency trying to sabotage ratings...", reported: true, date: "Mar 30, 2026" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-slate-300 dark:text-slate-600"
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        {rating}.0
      </span>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = reviewsData.filter((r) => {
    if (filter === "all") return true;
    if (filter === "reported") return r.reported;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor and moderate user reviews
          </p>
        </div>
        {reviewsData.filter(r => r.reported).length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
            <Flag className="h-4 w-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">
              {reviewsData.filter(r => r.reported).length} flagged reviews
            </span>
          </div>
        )}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {["all", "reported"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f === "reported" ? "⚠ Flagged" : f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3">Reviewer</th>
                <th className="px-6 py-3">Package</th>
                <th className="px-6 py-3">Agency</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Comment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review) => (
                <tr
                  key={review.id}
                  className={`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                    review.reported ? "bg-red-50/50 dark:bg-red-950/10" : ""
                  }`}
                >
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">{review.author}</td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">{review.package}</td>
                  <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{review.agency}</td>
                  <td className="px-6 py-3.5"><StarRating rating={review.rating} /></td>
                  <td className="px-6 py-3.5 max-w-xs">
                    <p className="text-slate-700 dark:text-slate-300 truncate">{review.comment}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    {review.reported ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                        <Flag className="h-3 w-3" /> Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        Valid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{review.date}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
