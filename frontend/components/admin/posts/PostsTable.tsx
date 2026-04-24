"use client";

import { useState } from "react";
import { Search, Trash2, Eye, Heart, MessageCircle, Flag, SearchX } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deletePostAdmin } from "@/services/admin.service";

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  likes: number;
  comments: number;
  reported: boolean;
  date: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}

interface PostsTableProps {
  initialPosts: Post[];
  currentTab: string;
  reportedCount: number;
  meta: Meta | null;
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    traveler: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    agency:   "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[role] || ""}`}>{role}</span>;
}

export function PostsTable({ initialPosts, currentTab, reportedCount, meta }: PostsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTabChange = (f: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", f);
    params.delete("page"); // Reset page when changing tabs
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const filtered = initialPosts.filter((p) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return p.author.toLowerCase().includes(lowerSearch) || 
           p.content.toLowerCase().includes(lowerSearch);
  });

  const handleDelete = (id: string) => {
    toast("Are you sure you want to delete this post?", {
      action: {
        label: "Delete",
        onClick: async () => {
          setLoadingId(id);
          try {
            const result = await deletePostAdmin(id);
            if (result?.success) {
              toast.success("Post deleted successfully");
            } else {
              toast.error(result?.message || "Failed to delete post");
            }
          } catch (error) {
            toast.error("An error occurred");
          } finally {
            setLoadingId(null);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleView = () => toast.info("View post details coming soon");

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
            <button key={f} onClick={() => handleTabChange(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${currentTab === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
              {f === "reported" ? "⚠ Reported" : f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No posts found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {search 
              ? `No results match your search for "${search}". Try adjusting your keywords.`
              : "There are no posts to display in this category right now."}
          </p>
        </div>
      ) : (
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
                        <button onClick={handleView} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(post.id)} disabled={loadingId === post.id} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors disabled:opacity-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && meta.total > meta.limit && (
            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
                </span>
                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
