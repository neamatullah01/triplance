"use client"

import { useState, useMemo } from "react"
import { Search, Trash2, Eye, Star, Flag, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { deleteReviewAdmin } from "@/services/admin.service"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300 dark:text-slate-600"
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        {rating}.0
      </span>
    </div>
  )
}

export function AdminReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [reviews, setReviews] = useState(initialReviews)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Mark rating 1 as flagged
  const processedReviews = useMemo(() => {
    return reviews.map((r) => ({
      ...r,
      reported: r.rating === 1,
    }))
  }, [reviews])

  const filtered = useMemo(() => {
    return processedReviews.filter((r) => {
      const matchFilter =
        filter === "all" ? true : filter === "reported" ? r.reported : true
      const matchSearch = r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.traveler?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.package?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.agency?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [processedReviews, filter, searchQuery])

  const flaggedCount = processedReviews.filter((r) => r.reported).length

  const handleDelete = (reviewId: string) => {
    toast("Are you sure you want to delete this review?", {
      action: {
        label: "Delete",
        onClick: async () => {
          setIsDeleting(reviewId)
          const toastId = toast.loading("Deleting review...")

          try {
            const res = await deleteReviewAdmin(reviewId)
            if (res?.success) {
              toast.success("Review deleted successfully", { id: toastId })
              setReviews((prev) => prev.filter((r) => r.id !== reviewId))
            } else {
              throw new Error(res?.message || "Failed to delete review")
            }
          } catch (error: any) {
            toast.error(error.message, { id: toastId })
          } finally {
            setIsDeleting(null)
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            Reviews
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor and moderate user reviews
          </p>
        </div>
        {flaggedCount > 0 && (
          <div className="flex shrink-0 self-start rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 sm:self-auto flex-center items-center gap-2 dark:border-red-900 dark:bg-red-950/30">
            <Flag className="h-4 w-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">
              {flaggedCount} flagged reviews
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          {["all", "reported"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {f === "reported" ? "⚠ Flagged" : "All"}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:ml-auto sm:w-auto sm:max-w-xs sm:flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-indigo-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:focus:border-indigo-900 dark:focus:ring-indigo-900"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:border-slate-800 dark:text-slate-500">
                <th className="px-4 py-3 sm:px-6">Reviewer</th>
                <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Package</th>
                <th className="hidden px-4 py-3 lg:table-cell sm:px-6">Agency</th>
                <th className="px-4 py-3 sm:px-6">Rating</th>
                <th className="hidden px-4 py-3 md:table-cell sm:px-6">Comment</th>
                <th className="px-4 py-3 sm:px-6">Status</th>
                <th className="hidden px-4 py-3 lg:table-cell sm:px-6">Date</th>
                <th className="px-4 py-3 text-right sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review) => (
                <tr
                  key={review.id}
                  className={`border-b border-slate-50 transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30 ${
                    review.reported ? "bg-red-50/50 dark:bg-red-950/10" : ""
                  }`}
                >
                  <td className="px-4 py-3.5 font-medium text-slate-900 sm:px-6 dark:text-white">
                    {review.traveler?.name || "Unknown"}
                  </td>
                  <td className="hidden px-4 py-3.5 text-slate-600 sm:table-cell sm:px-6 dark:text-slate-300">
                    {review.package?.title || "N/A"}
                  </td>
                  <td className="hidden px-4 py-3.5 text-slate-500 lg:table-cell sm:px-6 dark:text-slate-400">
                    {review.agency?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3.5 sm:px-6">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="hidden max-w-xs px-4 py-3.5 md:table-cell sm:px-6">
                    <p className="truncate text-slate-700 dark:text-slate-300">
                      {review.comment}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 sm:px-6">
                    {review.reported ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
                        <Flag className="h-3 w-3" /> Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        Valid
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3.5 text-slate-500 lg:table-cell sm:px-6 dark:text-slate-400">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 sm:px-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={isDeleting === review.id}
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-950/30"
                        title="Delete"
                      >
                        {isDeleting === review.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
