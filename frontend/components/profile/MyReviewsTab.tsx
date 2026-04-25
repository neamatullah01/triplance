"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Star,
  MapPin,
  CalendarDays,
  Building2,
  Trash2,
  Loader2,
} from "lucide-react"
import {
  getMyReviewedBookings,
  deleteReview,
} from "@/services/review.service"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function MyReviewsTab() {
  const [reviewedBookings, setReviewedBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Fetch reviewed bookings on mount
  useEffect(() => {
    ;(async () => {
      try {
        const data = await getMyReviewedBookings()
        setReviewedBookings(data || [])
      } catch {
        toast.error("Failed to load reviews.")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId)
    try {
      await deleteReview(reviewId)
      toast.success("Review deleted successfully.")
      setReviewedBookings((prev) =>
        prev.filter((b) => b.review?.id !== reviewId)
      )
      setConfirmDeleteId(null)
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete review.")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price)

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-amber-500" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Loading your reviews…
        </span>
      </div>
    )
  }

  // Empty
  if (reviewedBookings.length === 0) {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800"
      >
        <Star className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          No reviews yet
        </h3>
        <p className="text-slate-500">
          Review your trips after you complete them.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {reviewedBookings.map((booking) => {
        const review = booking.review
        const isConfirming = confirmDeleteId === review?.id

        return (
          <motion.div
            key={booking.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Top: Booking mini-card */}
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
              {/* Package thumbnail */}
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-32">
                <img
                  src={
                    booking.package?.images?.[0] ||
                    booking.package?.image ||
                    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                  }
                  alt={booking.package?.title || "Package"}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Booking info */}
              <div className="flex-1">
                <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">
                  {booking.package?.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  {booking.package?.destination && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {booking.package.destination}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(
                      booking.selectedDate || booking.startDate || booking.createdAt
                    )}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  {booking.package?.agency && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Building2 className="h-3.5 w-3.5" />
                      {booking.package.agency.name}
                    </span>
                  )}
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Review content */}
            {review && (
              <div className="border-t border-slate-100 bg-amber-50/40 px-5 py-4 dark:border-slate-800 dark:bg-amber-900/10">
                {/* Stars + label */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {review.rating}/5
                  </span>
                  {review.createdAt && (
                    <span className="ml-auto text-xs text-slate-400">
                      {formatDate(review.createdAt)}
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Delete action */}
                <div className="mt-3 flex items-center justify-end gap-2">
                  {!isConfirming ? (
                    <button
                      onClick={() => setConfirmDeleteId(review.id)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Review
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={!!deletingId}
                        className="cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={!!deletingId}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === review.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        {deletingId === review.id ? "Deleting…" : "Confirm"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
