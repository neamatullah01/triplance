"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  Loader2,
  MapPin,
  ArrowUp,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getFeedPost } from "@/services/post.service"
import { getUser } from "@/services/auth.service"
import { getFollowing } from "@/services/follow.service"
import { likePost, unlikePost } from "@/services/like.service"
import { getComments, addComment } from "@/services/comment.service"
import { FollowButton } from "@/components/shared/FollowButton"
import Link from "next/link"
import { toast } from "sonner"

export function MainFeed() {
  const [feedItems, setFeedItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({})
  const [commentsData, setCommentsData] = useState<Record<string, any[]>>({})
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [isSubmittingComment, setIsSubmittingComment] = useState<
    Record<string, boolean>
  >({})
  const [loadingComments, setLoadingComments] = useState<
    Record<string, boolean>
  >({})
  const [replyTargets, setReplyTargets] = useState<
    Record<string, { id: string; name: string } | null>
  >({})

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean
    images: string[]
    currentIndex: number
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  })

  const observerTarget = useRef(null)
  const fetchingRef = useRef(false)

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return

    fetchingRef.current = true
    setIsLoading(true)

    try {
      const result = await getFeedPost(page, 10)

      if (result && result.success && result.data) {
        const fetchedItems = Array.isArray(result.data?.data)
          ? result.data.data
          : Array.isArray(result.data)
            ? result.data
            : []

        if (fetchedItems.length > 0) {
          setFeedItems((prev) => {
            const newItems = fetchedItems.filter(
              (newItem: any) => !prev.some((item) => item.id === newItem.id)
            )
            return [...prev, ...newItems]
          })

          setLikedPosts((prevLikes) => {
            const updated = new Set(prevLikes)
            fetchedItems.forEach((item: any) => {
              if (item.isLiked || (item.likes && item.likes.length > 0)) {
                updated.add(item.id)
              }
            })
            return updated
          })

          setPage((prev) => prev + 1)
        }

        if (fetchedItems.length < 10) {
          setHasMore(false)
        }
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to load feed", error)
    } finally {
      setIsLoading(false)
      fetchingRef.current = false
    }
  }, [page, hasMore])

  const refreshFeed = useCallback(async () => {
    if (fetchingRef.current) return

    fetchingRef.current = true
    setIsLoading(true)
    setFeedItems([])

    try {
      const result = await getFeedPost(1, 10)

      if (result && result.success && result.data) {
        const fetchedItems = Array.isArray(result.data?.data)
          ? result.data.data
          : Array.isArray(result.data)
            ? result.data
            : []

        setFeedItems(fetchedItems)

        setLikedPosts((prevLikes) => {
          const updated = new Set(prevLikes)
          fetchedItems.forEach((item: any) => {
            if (item.isLiked || (item.likes && item.likes.length > 0)) {
              updated.add(item.id)
            }
          })
          return updated
        })

        setPage(2)
        setHasMore(fetchedItems.length >= 10)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to refresh feed", error)
    } finally {
      setIsLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMore, hasMore])

  useEffect(() => {
    async function loadFollowingList() {
      try {
        const user = await getUser()
        if (user?.id) {
          const list = await getFollowing(user.id)
          setFollowing(new Set(list.map((f: any) => f.followingId)))
        }
      } catch (error) {
        // silently ignore error
      }
    }
    loadFollowingList()
  }, [])

  useEffect(() => {
    const handleRemoteRefresh = () => {
      const scrollContainer =
        document.querySelector("main.overflow-y-auto") || window
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" })
      refreshFeed()
    }

    window.addEventListener("refreshMainFeed", handleRemoteRefresh)
    return () =>
      window.removeEventListener("refreshMainFeed", handleRemoteRefresh)
  }, [refreshFeed])

  const formatTime = (dateString: string) => {
    if (!dateString) return "Just now"
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const handleToggleLike = async (postId: string, feedType: string) => {
    const isLiked = likedPosts.has(postId)

    setLikedPosts((prev) => {
      const next = new Set(prev)
      if (isLiked) next.delete(postId)
      else next.add(postId)
      return next
    })

    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id === postId) {
          const count = item._count?.likes || 0
          return {
            ...item,
            _count: {
              ...item._count,
              likes: isLiked ? Math.max(0, count - 1) : count + 1,
            },
          }
        }
        return item
      })
    )

    try {
      const res = isLiked ? await unlikePost(postId) : await likePost(postId)
      if (!res?.success) throw new Error(res?.message || "Failed to like post")
    } catch (error: any) {
      toast.error(error.message)
      setLikedPosts((prev) => {
        const next = new Set(prev)
        if (isLiked) next.add(postId)
        else next.delete(postId)
        return next
      })

      setFeedItems((prev) =>
        prev.map((item) => {
          if (item.id === postId) {
            const count = item._count?.likes || 0
            return {
              ...item,
              _count: {
                ...item._count,
                likes: isLiked ? count + 1 : Math.max(0, count - 1),
              },
            }
          }
          return item
        })
      )
    }
  }

  const handleToggleComments = async (postId: string, feedType: string) => {
    const isExpanded = !!expandedComments[postId]
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }))

    if (!isExpanded && !commentsData[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }))
      try {
        const comments = await getComments(postId)
        setCommentsData((prev) => ({
          ...prev,
          [postId]: Array.isArray(comments) ? comments : comments?.data || [],
        }))
      } catch (err) {
        toast.error("Failed to load comments")
      } finally {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }))
      }
    }
  }

  const handlePostComment = async (postId: string, feedType: string) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }))
    const toastId = toast.loading("Posting comment...")

    const parentId = replyTargets[postId]?.id

    try {
      const res = await addComment(postId, text, parentId)

      if (!res?.success)
        throw new Error(res?.message || "Failed to post comment")

      toast.success("Comment added", { id: toastId })
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
      setReplyTargets((prev) => ({ ...prev, [postId]: null }))

      setFeedItems((prev) =>
        prev.map((item) =>
          item.id === postId
            ? {
                ...item,
                _count: {
                  ...item._count,
                  comments: (item._count?.comments || 0) + 1,
                },
              }
            : item
        )
      )

      const newComment = res.data || {
        id: Math.random().toString(),
        content: text,
        parentId,
        createdAt: new Date().toISOString(),
        user: { name: "You" },
      }

      setCommentsData((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }))
    } catch (error: any) {
      toast.error(error.message, { id: toastId })
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const renderImageGrid = (images: string[]) => {
    if (!images || images.length === 0) return null

    const openLightbox = (index: number) => {
      setLightbox({ isOpen: true, images, currentIndex: index })
    }

    if (images.length === 1) {
      return (
        <div
          onClick={() => openLightbox(0)}
          className="group mb-4 h-64 w-full cursor-pointer overflow-hidden rounded-2xl sm:h-96"
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
        <div className="mb-4 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
          <div
            onClick={() => openLightbox(0)}
            className="group aspect-[4/5] w-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[0]}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div
            onClick={() => openLightbox(1)}
            className="group aspect-[4/5] w-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[1]}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      )
    }

    if (images.length === 3) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
          <div
            onClick={() => openLightbox(0)}
            className="group col-span-2 aspect-[2/1] w-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[0]}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div
            onClick={() => openLightbox(1)}
            className="group aspect-square w-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[1]}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div
            onClick={() => openLightbox(2)}
            className="group aspect-square w-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[2]}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      )
    }

    return (
      <div className="mb-4 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
        <div
          onClick={() => openLightbox(0)}
          className="group aspect-square w-full cursor-pointer overflow-hidden"
        >
          <img
            src={images[0]}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div
          onClick={() => openLightbox(1)}
          className="group aspect-square w-full cursor-pointer overflow-hidden"
        >
          <img
            src={images[1]}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div
          onClick={() => openLightbox(2)}
          className="group aspect-square w-full cursor-pointer overflow-hidden"
        >
          <img
            src={images[2]}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div
          onClick={() => openLightbox(3)}
          className="group relative aspect-square w-full cursor-pointer overflow-hidden"
        >
          <img
            src={images[3]}
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
    <div className="relative flex flex-col gap-6">
      {/* Filter Chips */}
      <div className="sticky top-0 z-30 -mx-1 flex flex-wrap items-center justify-center gap-3 bg-white/80 px-1 pt-2 pb-4 backdrop-blur-xl dark:bg-slate-950/80">
        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("refreshMainFeed"))
          }
          className="cursor-pointer rounded-full bg-indigo-700 px-5 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-indigo-800"
        >
          All Posts
        </button>
        <button className="cursor-pointer rounded-full bg-blue-100 px-5 py-2 text-sm font-medium whitespace-nowrap text-blue-700 transition-colors hover:bg-blue-200">
          Top Experiences
        </button>
        <button className="cursor-pointer rounded-full bg-blue-100 px-5 py-2 text-sm font-medium whitespace-nowrap text-blue-700 transition-colors hover:bg-blue-200">
          Local Guides
        </button>
        <button className="cursor-pointer rounded-full bg-blue-100 px-5 py-2 text-sm font-medium whitespace-nowrap text-blue-700 transition-colors hover:bg-blue-200">
          Photography
        </button>
      </div>

      {/* Dynamic Infinite Feed Timeline */}
      {feedItems.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          {item.feedType === "PACKAGE" ? (
            /* --- TYPE 1: AGENCY PACKAGE TIMELINE CARD --- */
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-indigo-200 bg-indigo-900 font-bold text-white shadow-sm dark:border-slate-700">
                    {item.author?.profileImage ? (
                      <img
                        src={item.author.profileImage}
                        alt={item.author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : item.author?.name ? (
                      item.author.name.substring(0, 1).toUpperCase()
                    ) : (
                      "A"
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.author?.name || "Agency"}
                      </h4>
                      {/* ✅ FIX: Solid blue circle with white checkmark inside */}
                      <CheckCircle2 className="h-4 w-4 fill-blue-500 text-white" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Agency Spotlight • Sponsored
                    </p>
                  </div>
                </div>
                {item.author?.id && following.has(item.author.id) ? (
                  <Link href={`/agencies/${item.author.id}`}>
                    <button className="cursor-pointer rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                      View
                    </button>
                  </Link>
                ) : (
                  <FollowButton
                    targetUserId={item.author?.id}
                    initialIsFollowing={false}
                    variant="pill"
                    targetUserName={item.author?.name}
                    onFollowChange={(isNowFollowing) => {
                      if (isNowFollowing && item.author?.id) {
                        setFollowing((prev) =>
                          new Set(prev).add(item.author.id)
                        )
                      }
                    }}
                  />
                )}
              </div>

              {renderImageGrid(item.images)}

              <h3 className="mb-2 truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                {item.content?.split("\n\n")[0] || "Exclusive Tour Package"}
              </h3>
              <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.content?.split("\n\n")[1] || item.content}
              </p>

              {/* ✅ FIX: Wrap Button inside Next.js Link pointing to /explore/[packageId] */}
              <Link href={`/explore/${item.id}`} className="block w-full">
                <button className="w-full cursor-pointer rounded-xl bg-rose-800 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-900">
                  View Expedition Details
                </button>
              </Link>
            </>
          ) : (
            /* --- TYPES 2 & 3: REGULAR POSTS (Traveler AND Agency) --- */
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-100 bg-slate-200 dark:border-slate-700 dark:bg-slate-800">
                    {item.author?.profileImage ? (
                      <img
                        src={item.author.profileImage}
                        alt={item.author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-200 font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {item.author?.name
                          ? item.author.name.substring(0, 1).toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.author?.name || "Traveler"}
                      </h4>
                      {/* ✅ FIX: Solid blue circle with white checkmark inside */}
                      {(item.author?.role === "AGENCY" ||
                        item.author?.accountType === "AGENCY") && (
                        <CheckCircle2 className="h-4 w-4 fill-blue-500 text-white" />
                      )}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatTime(item.createdAt)}{" "}
                      {item.location && (
                        <>
                          <MapPin className="ml-1 inline h-3 w-3" />{" "}
                          {item.location}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {item.content}
              </p>

              {renderImageGrid(item.images)}
            </>
          )}

          {/* Action Bar (Hidden for Packages) */}
          {item.feedType !== "PACKAGE" && (
            <>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/50">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleToggleLike(item.id, item.feedType)}
                    className={`group flex cursor-pointer items-center gap-2 transition-colors active:scale-90 ${likedPosts.has(item.id) ? "text-rose-600" : "text-slate-500 hover:text-rose-600"}`}
                  >
                    <Heart
                      className="h-5 w-5 transition-transform group-hover:scale-110"
                      fill={likedPosts.has(item.id) ? "currentColor" : "none"}
                    />
                    <span className="text-sm font-medium">
                      {item._count?.likes || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => handleToggleComments(item.id, item.feedType)}
                    className={`group flex cursor-pointer items-center gap-2 transition-colors ${expandedComments[item.id] ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"}`}
                  >
                    <MessageCircle
                      className="h-5 w-5 transition-transform group-hover:scale-110"
                      fill={expandedComments[item.id] ? "currentColor" : "none"}
                    />
                    <span className="text-sm font-medium">
                      {item._count?.comments || 0}
                    </span>
                  </button>
                  <button className="cursor-pointer text-slate-500 transition-colors hover:text-blue-600">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <button className="cursor-pointer text-slate-500 transition-colors hover:text-amber-600">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>

              {/* Expandable Comments Section */}
              <AnimatePresence>
                {expandedComments[item.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                      {loadingComments[item.id] ? (
                        <div className="flex items-center justify-center py-4">
                          <Compass className="h-6 w-6 animate-spin text-indigo-500" />
                        </div>
                      ) : commentsData[item.id]?.length === 0 ? (
                        <p className="rounded-xl bg-slate-50 py-2 text-center text-xs text-slate-500 italic dark:bg-slate-800/30">
                          No comments yet. Start the conversation!
                        </p>
                      ) : (
                        <div className="custom-scrollbar flex max-h-60 flex-col gap-3 overflow-y-auto pr-2">
                          {(
                            commentsData[item.id]?.filter((c) => !c.parentId) ||
                            []
                          ).map((rootComment: any) => (
                            <div
                              key={rootComment.id}
                              className="flex flex-col gap-2"
                            >
                              <div className="flex gap-2.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-200 dark:border-slate-600 dark:bg-slate-700">
                                  {rootComment.user?.profileImage ? (
                                    <img
                                      src={rootComment.user.profileImage}
                                      alt={rootComment.user.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
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
                                      {formatTime(rootComment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs break-words text-slate-600 dark:text-slate-300">
                                    {rootComment.text ||
                                      rootComment.content ||
                                      rootComment.textcontent}
                                  </p>
                                  <div className="mt-1.5 flex items-center gap-3 pt-0.5">
                                    <button
                                      onClick={() =>
                                        setReplyTargets((prev) => ({
                                          ...prev,
                                          [item.id]: {
                                            id: rootComment.id,
                                            name:
                                              rootComment.user?.name || "User",
                                          },
                                        }))
                                      }
                                      className="cursor-pointer text-[10px] font-bold text-indigo-500 transition-colors hover:underline"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Child Replies */}
                              {(
                                commentsData[item.id]?.filter(
                                  (child) => child.parentId === rootComment.id
                                ) || []
                              ).map((reply: any) => (
                                <div
                                  key={reply.id}
                                  className="relative flex gap-2.5 py-1 pr-2 pl-10"
                                >
                                  <div className="absolute top-0 bottom-4 left-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                                  <div className="absolute bottom-4 left-6 h-px w-3 bg-slate-200 dark:bg-slate-700"></div>

                                  <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-200 dark:border-slate-600 dark:bg-slate-700">
                                    {reply.user?.profileImage ? (
                                      <img
                                        src={reply.user.profileImage}
                                        alt={reply.user.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
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
                                        {formatTime(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 text-xs break-words text-slate-600 dark:text-slate-300">
                                      {reply.text ||
                                        reply.content ||
                                        reply.textcontent}
                                    </p>
                                    <div className="mt-1.5 flex items-center gap-3 pt-0.5">
                                      <button
                                        onClick={() =>
                                          setReplyTargets((prev) => ({
                                            ...prev,
                                            [item.id]: {
                                              id: rootComment.id,
                                              name: reply.user?.name || "User",
                                            },
                                          }))
                                        }
                                        className="cursor-pointer text-[10px] font-bold text-indigo-500 transition-colors hover:underline"
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Input Bar */}
                      <div className="mt-2 flex flex-col gap-2">
                        {replyTargets[item.id] && (
                          <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 dark:border-indigo-800 dark:bg-indigo-900/30">
                            <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                              Replying to <b>@{replyTargets[item.id]?.name}</b>
                            </span>
                            <button
                              onClick={() =>
                                setReplyTargets((prev) => ({
                                  ...prev,
                                  [item.id]: null,
                                }))
                              }
                              className="cursor-pointer text-xs font-bold text-indigo-400 hover:text-indigo-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={
                              replyTargets[item.id]
                                ? `Write a reply...`
                                : `Write a comment...`
                            }
                            value={commentInputs[item.id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handlePostComment(item.id, item.feedType)
                            }
                            className="flex-1 rounded-full border-none bg-slate-100 px-4 py-2.5 text-sm text-slate-800 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:bg-slate-800 dark:text-slate-200"
                            disabled={isSubmittingComment[item.id]}
                          />
                          <button
                            onClick={() =>
                              handlePostComment(item.id, item.feedType)
                            }
                            disabled={
                              !commentInputs[item.id]?.trim() ||
                              isSubmittingComment[item.id]
                            }
                            className="shrink-0 cursor-pointer rounded-full bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale"
                          >
                            {isSubmittingComment[item.id] ? (
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
            </>
          )}
        </article>
      ))}

      {/* NEW TRIPLANCE THEME LOADER & Infinite Scroll Sentry */}
      <div
        ref={observerTarget}
        className="flex min-h-[120px] flex-col items-center justify-center py-6"
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-3 py-4"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 shadow-inner dark:bg-indigo-900/30">
              <Compass
                className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400"
                style={{ animationDuration: "3s" }}
              />
              <div
                className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500/80 border-l-indigo-500/80"
                style={{ animationDuration: "1.5s" }}
              />
            </div>
            <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">
              Mapping Journeys...
            </p>
          </motion.div>
        ) : !hasMore && feedItems.length > 0 ? (
          <div className="mt-4 flex flex-col items-center gap-4 pb-10">
            <button
              onClick={() => {
                const scrollContainer =
                  document.querySelector("main.overflow-y-auto") || window
                scrollContainer.scrollTo({ top: 0, behavior: "smooth" })
                refreshFeed()
              }}
              title="Back to top"
              className="animate-bounce cursor-pointer rounded-full bg-indigo-100 p-3 text-indigo-600 shadow-sm transition-colors hover:animate-none hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-800"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        ) : !hasMore && feedItems.length === 0 ? (
          <p className="pb-10 text-sm font-medium text-slate-500">
            No feed posts available.
          </p>
        ) : null}
      </div>

      {/* Fullscreen Lightbox Viewer Modal */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setLightbox({ ...lightbox, isOpen: false })}
          >
            <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
              <span className="text-sm font-medium tracking-wide text-white/80">
                {lightbox.currentIndex + 1} / {lightbox.images.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({ ...lightbox, isOpen: false })
                }}
                className="cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {lightbox.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({
                    ...lightbox,
                    currentIndex:
                      (lightbox.currentIndex - 1 + lightbox.images.length) %
                      lightbox.images.length,
                  })
                }}
                className="absolute left-4 z-10 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
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
              src={lightbox.images[lightbox.currentIndex]}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {lightbox.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({
                    ...lightbox,
                    currentIndex:
                      (lightbox.currentIndex + 1) % lightbox.images.length,
                  })
                }}
                className="absolute right-4 z-10 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
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
