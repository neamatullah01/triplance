"use client"

import { useState } from "react"
import {
  Heart,
  MessageCircle,
  Trash2,
  MapPin,
  Loader2,
  Send,
  Compass,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Import your services (adjust paths if needed)
import { deletePost } from "@/services/post.service"
import { likePost, unlikePost } from "@/services/like.service"
import { getComments, addComment } from "@/services/comment.service"

interface PostProps {
  post: any // Using any to accommodate your flexible backend structure
}

export function AgencyPostCard({ post }: PostProps) {
  const router = useRouter()

  // ─── Post Actions State ───
  const [isDeleting, setIsDeleting] = useState(false)

  // ─── Like State (Optimistic) ───
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)

  // ─── Comments State ───
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [commentCount, setCommentCount] = useState(post._count?.comments || 0)

  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [replyTarget, setReplyTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  // ─── Lightbox State ───
  const [lightbox, setLightbox] = useState({ isOpen: false, currentIndex: 0 })

  // ─── Helpers ───
  const formatDate = (dateString: string) => {
    if (!dateString) return "Just now"
    const diff = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000
    )
    if (diff < 60) return "Just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(dateString).toLocaleDateString()
  }

  const initials = post.author?.name
    ? post.author.name.substring(0, 2).toUpperCase()
    : "TA"

  // ─── Handlers ───
  const handleDelete = () => {
    toast("Are you sure you want to delete this post?", {
      action: {
        label: "Delete",
        onClick: async () => {
          setIsDeleting(true)
          try {
            await deletePost(post.id)
            toast.success("Post deleted")
            router.refresh()
          } catch (error: any) {
            toast.error(error.message || "Failed to delete post")
            setIsDeleting(false)
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    })
  }

  const handleToggleLike = async () => {
    const wasLiked = isLiked
    // Optimistic Update
    setIsLiked(!wasLiked)
    setLikeCount((prev: number) =>
      wasLiked ? Math.max(0, prev - 1) : prev + 1
    )

    try {
      const res = wasLiked ? await unlikePost(post.id) : await likePost(post.id)
      if (!res?.success) throw new Error()
    } catch (error) {
      // Revert on failure
      toast.error("Failed to update like")
      setIsLiked(wasLiked)
      setLikeCount((prev: number) =>
        wasLiked ? prev + 1 : Math.max(0, prev - 1)
      )
    }
  }

  const handleToggleComments = async () => {
    const willShow = !showComments
    setShowComments(willShow)

    if (willShow && comments.length === 0) {
      setIsLoadingComments(true)
      try {
        const res = await getComments(post.id)
        setComments(Array.isArray(res) ? res : res?.data || [])
      } catch (err) {
        toast.error("Failed to load comments")
      } finally {
        setIsLoadingComments(false)
      }
    }
  }

  const handlePostComment = async () => {
    if (!commentText.trim()) return

    setIsSubmittingComment(true)
    const toastId = toast.loading("Posting comment...")

    try {
      const res = await addComment(post.id, commentText, replyTarget?.id)
      if (!res?.success)
        throw new Error(res?.message || "Failed to post comment")

      toast.success("Comment added", { id: toastId })

      const newComment = res.data || {
        id: Math.random().toString(),
        content: commentText,
        text: commentText,
        parentId: replyTarget?.id,
        createdAt: new Date().toISOString(),
        user: { name: "You", profileImage: post.author?.profileImage },
      }

      setComments((prev) => [...prev, newComment])
      setCommentCount((prev: number) => prev + 1)
      setCommentText("")
      setReplyTarget(null)
    } catch (error: any) {
      toast.error(error.message, { id: toastId })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // ─── Renderers ───
  const renderImageGrid = (images: string[]) => {
    if (!images || images.length === 0) return null

    const openLightbox = (index: number) =>
      setLightbox({ isOpen: true, currentIndex: index })

    if (images.length === 1) {
      return (
        <div
          onClick={() => openLightbox(0)}
          className="group mt-3 h-64 w-full cursor-pointer overflow-hidden rounded-2xl sm:h-96"
        >
          <img
            src={images[0]}
            alt="Post Media"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )
    }

    if (images.length === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className="group aspect-[4/5] w-full cursor-pointer overflow-hidden"
            >
              <img
                src={images[i]}
                alt="Media"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )
    }

    if (images.length === 3) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
          <div
            onClick={() => openLightbox(0)}
            className="group col-span-2 aspect-[2/1] w-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[0]}
              alt="Media"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {[1, 2].map((i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className="group aspect-square w-full cursor-pointer overflow-hidden"
            >
              <img
                src={images[i]}
                alt="Media"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="mt-3 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            onClick={() => openLightbox(i)}
            className="group aspect-square w-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[i]}
              alt="Media"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
        <div
          onClick={() => openLightbox(3)}
          className="group relative aspect-square w-full cursor-pointer overflow-hidden"
        >
          <img
            src={images[3]}
            alt="Media"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {images.length > 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl font-bold text-white backdrop-blur-[2px] transition-all group-hover:bg-black/40">
              +{images.length - 4}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm">
            {post.author?.profileImage ? (
              <img
                src={post.author.profileImage}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {post.author?.name || "Agency"}
            </h3>
            <p className="text-xs text-slate-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
          title="Delete Post"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Content ── */}
      <div className="mt-4 space-y-3">
        {post.location && (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            <MapPin className="h-3 w-3" /> {post.location}
          </span>
        )}
        <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
          {post.content}
        </p>

        {renderImageGrid(post.images)}
      </div>

      {/* ── Action Buttons ── */}
      <div className="mt-5 flex items-center gap-6 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          onClick={handleToggleLike}
          className={`group flex cursor-pointer items-center gap-2 transition-colors active:scale-90 ${isLiked ? "text-rose-600" : "text-slate-500 hover:text-rose-600"}`}
        >
          <Heart
            className="h-5 w-5 transition-transform group-hover:scale-110"
            fill={isLiked ? "currentColor" : "none"}
          />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className={`group flex cursor-pointer items-center gap-2 transition-colors ${showComments ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"}`}
        >
          <MessageCircle
            className="h-5 w-5 transition-transform group-hover:scale-110"
            fill={showComments ? "currentColor" : "none"}
          />
          <span className="text-sm font-medium">{commentCount}</span>
        </button>
      </div>

      {/* ── Comments Section ── */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              {/* Comment List */}
              {isLoadingComments ? (
                <div className="flex items-center justify-center py-4">
                  <Compass className="h-6 w-6 animate-spin text-indigo-500" />
                </div>
              ) : comments.length === 0 ? (
                <p className="rounded-xl bg-slate-50 py-2 text-center text-xs text-slate-500 italic dark:bg-slate-800/30">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                <div className="custom-scrollbar flex max-h-60 flex-col gap-3 overflow-y-auto pr-2">
                  {comments
                    .filter((c) => !c.parentId)
                    .map((rootComment) => (
                      <div key={rootComment.id} className="flex flex-col gap-2">
                        {/* Root Comment */}
                        <div className="flex gap-2.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            {rootComment.user?.profileImage ? (
                              <img
                                src={rootComment.user.profileImage}
                                alt="User"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-slate-500">
                                {rootComment.user?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {rootComment.user?.name || "Traveler"}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatDate(rootComment.createdAt)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs break-words text-slate-600 dark:text-slate-300">
                              {rootComment.text || rootComment.content}
                            </p>
                            <button
                              onClick={() =>
                                setReplyTarget({
                                  id: rootComment.id,
                                  name: rootComment.user?.name || "User",
                                })
                              }
                              className="mt-1.5 self-start text-[10px] font-bold text-indigo-500 hover:underline"
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {/* Nested Replies */}
                        {comments
                          .filter((child) => child.parentId === rootComment.id)
                          .map((reply) => (
                            <div
                              key={reply.id}
                              className="relative flex gap-2.5 py-1 pr-2 pl-10"
                            >
                              <div className="absolute top-0 bottom-4 left-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                              <div className="absolute bottom-4 left-6 h-px w-3 bg-slate-200 dark:bg-slate-700"></div>
                              <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                {reply.user?.profileImage ? (
                                  <img
                                    src={reply.user.profileImage}
                                    alt="User"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-500">
                                    {reply.user?.name
                                      ?.charAt(0)
                                      .toUpperCase() || "U"}
                                  </span>
                                )}
                              </div>
                              <div className="flex min-w-0 flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    {reply.user?.name || "Traveler"}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs break-words text-slate-600 dark:text-slate-300">
                                  {reply.text || reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              )}

              {/* Comment Input */}
              <div className="mt-2 flex flex-col gap-2">
                {replyTarget && (
                  <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 dark:border-indigo-800 dark:bg-indigo-900/30">
                    <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                      Replying to <b>@{replyTarget.name}</b>
                    </span>
                    <button
                      onClick={() => setReplyTarget(null)}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={
                      replyTarget ? "Write a reply..." : "Write a comment..."
                    }
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                    disabled={isSubmittingComment}
                    className="flex-1 rounded-full border-none bg-slate-100 px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:bg-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={handlePostComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="shrink-0 cursor-pointer rounded-full bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="-ml-0.5 h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox Overlay ── */}
      <AnimatePresence>
        {lightbox.isOpen && post.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setLightbox({ ...lightbox, isOpen: false })}
          >
            <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
              <span className="text-sm font-medium tracking-wide text-white/80">
                {lightbox.currentIndex + 1} / {post.images.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({ ...lightbox, isOpen: false })
                }}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {post.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({
                    ...lightbox,
                    currentIndex:
                      (lightbox.currentIndex - 1 + post.images.length) %
                      post.images.length,
                  })
                }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            <motion.img
              key={lightbox.currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={post.images[lightbox.currentIndex]}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {post.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({
                    ...lightbox,
                    currentIndex:
                      (lightbox.currentIndex + 1) % post.images.length,
                  })
                }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
