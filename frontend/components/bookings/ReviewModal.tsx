"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Star, X, Send, Loader2, Trash2 } from "lucide-react"
import {
  createReview,
  deleteReview,
  getReviewByBookingId,
} from "@/services/review.service"

interface ExistingReview {
  id: string
  rating: number
  comment: string
  createdAt?: string
}

interface ReviewModalProps {
  bookingId: string
  packageTitle?: string
  onClose: () => void
  /** Called after a successful submit or delete so the parent can refresh state */
  onReviewChange?: () => void
}

type ModalView = "loading" | "form" | "existing"

export function ReviewModal({
  bookingId,
  packageTitle,
  onClose,
  onReviewChange,
}: ReviewModalProps) {
  const [view, setView] = useState<ModalView>("loading")
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(
    null
  )

  // Form state
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete state
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
  }

  // ── Fetch existing review on mount ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await getReviewByBookingId(bookingId)
        if (cancelled) return
        if (result?.data) {
          setExistingReview(result.data)
          setView("existing")
        } else {
          setView("form")
        }
      } catch {
        // If fetch fails, fall back to form
        if (!cancelled) setView("form")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [bookingId])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await createReview({ bookingId, rating, comment })
      const created: ExistingReview = result?.data ?? {
        id: "",
        rating,
        comment,
      }
      setExistingReview(created)
      setView("existing")
      toast.success("Review submitted! Thank you 🎉", { duration: 4000 })
      onReviewChange?.()
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!existingReview?.id) return
    setIsDeleting(true)
    try {
      await deleteReview(existingReview.id)
      toast.success("Review deleted successfully.")
      // Reset to form so user can leave a new review
      setExistingReview(null)
      setShowDeleteConfirm(false)
      setRating(5)
      setComment("")
      setView("form")
      onReviewChange?.()
    } catch (err: any) {
      toast.error(err?.message || "Could not delete review. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Render stars (read-only for existing, interactive for form) ────────────
  const renderStars = (
    value: number,
    interactive = false
  ) => (
    <div className="flex items-center justify-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={interactive ? () => setRating(star) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          className={
            interactive
              ? "cursor-pointer transition-transform hover:scale-110 active:scale-95"
              : "cursor-default"
          }
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              star <= (interactive ? hoverRating || value : value)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
            }`}
          />
        </button>
      ))}
    </div>
  )

  // ── Header title based on view ────────────────────────────────────────────
  const headerTitle =
    view === "existing" ? "Your Review" : view === "form" ? "Leave a Review" : "Review"

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="review-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      >
        {/* Modal Panel */}
        <motion.div
          key="review-panel"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 px-6 py-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-xl p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close review modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Star className="h-6 w-6 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black">{headerTitle}</h2>
                {packageTitle && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-white/80">
                    {packageTitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── LOADING STATE ── */}
          {view === "loading" && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            </div>
          )}

          {/* ── EXISTING REVIEW STATE ── */}
          {view === "existing" && existingReview && (
            <div className="p-6">
              {/* Stars (read-only) */}
              <div className="mb-1 text-center">
                {renderStars(existingReview.rating)}
                <p className="mt-1.5 text-sm font-bold text-amber-500">
                  {ratingLabels[existingReview.rating]}
                </p>
              </div>

              {/* Comment */}
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  &ldquo;{existingReview.comment}&rdquo;
                </p>
                {existingReview.createdAt && (
                  <p className="mt-2 text-xs text-slate-400">
                    Reviewed on{" "}
                    {new Date(existingReview.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                {/* Delete confirm toggle */}
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-rose-200 py-3 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Review
                  </button>
                ) : (
                  <div className="flex flex-1 gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1 cursor-pointer rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {isDeleting ? "Deleting…" : "Confirm"}
                    </button>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 cursor-pointer rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ── FORM STATE ── */}
          {view === "form" && (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Star Rating */}
              <div className="mb-6 text-center">
                <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  How was your experience?
                </p>
                {renderStars(rating, true)}
                <p className="mt-2 text-sm font-bold text-amber-500">
                  {ratingLabels[hoverRating || rating]}
                </p>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Your Review
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  required
                  minLength={10}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience — what did you love? What could be improved?"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
                <p className="mt-1.5 text-right text-xs text-slate-400">
                  {comment.trim().length}/10 min characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 cursor-pointer rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || comment.trim().length < 10}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-sm font-bold text-white shadow-sm shadow-amber-500/30 transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
