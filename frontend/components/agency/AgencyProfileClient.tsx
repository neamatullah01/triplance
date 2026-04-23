"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  MapPin,
  Globe,
  Star,
  Users,
  CheckCircle2,
  Map,
  Grid,
  MessageSquare,
  UserPlus,
  Check,
  ExternalLink,
  Send,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Loader2,
} from "lucide-react"

// You may need to adjust these imports based on your actual file paths
import { likePost, unlikePost } from "@/services/like.service"
import { getComments, addComment } from "@/services/comment.service"
import { FollowButton } from "@/components/shared/FollowButton"

// --- Framer Motion Variants ---
const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export function AgencyProfileClient({
  agency,
  initialIsFollowing,
}: {
  agency: any
  initialIsFollowing: boolean
}) {
  const [activeTab, setActiveTab] = useState("packages")
  const [followerCount, setFollowerCount] = useState(
    agency._count?.followers || 0
  )

  // --- COMMENTS STATE ---
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


  // --- POSTS STATE (For Optimistic Updates) ---
  const [localPosts, setLocalPosts] = useState<any[]>(agency.posts || [])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    ;(agency.posts || []).forEach((post: any) => {
      if (post.isLiked || (post.likes && post.likes.length > 0)) {
        initial.add(post.id)
      }
    })
    return initial
  })

  // Optional: Update if agency.posts changes (e.g. via prop refresh)
  useEffect(() => {
    setLikedPosts((prev) => {
      const updated = new Set(prev)
      ;(agency.posts || []).forEach((post: any) => {
        if (post.isLiked || (post.likes && post.likes.length > 0)) {
          updated.add(post.id)
        }
      })
      return updated
    })
  }, [agency.posts])

  const tabs = [
    {
      id: "packages",
      label: "Packages",
      icon: Map,
      count: agency.packages?.length || 0,
    },
    { id: "posts", label: "Posts", icon: Grid, count: localPosts.length || 0 },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      count: agency.reviewsReceived?.length || 0,
    },
  ]

  // --- HANDLERS ---

  const handleToggleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId)
    setLikedPosts((prev) => {
      const next = new Set(prev)
      if (isLiked) next.delete(postId)
      else next.add(postId)
      return next
    })

    setLocalPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const count = post._count?.likes || 0
          return {
            ...post,
            _count: {
              ...post._count,
              likes: isLiked ? Math.max(0, count - 1) : count + 1,
            },
          }
        }
        return post
      })
    )

    try {
      const res = isLiked ? await unlikePost(postId) : await likePost(postId)
      if (!res?.success) {
        const errorMsg = res?.message?.toLowerCase() || ""
        // If we tried to like, but it was already liked, or tried to unlike but it wasn't liked,
        // our local state was out of sync. Don't revert, just keep the new optimistic state.
        if (
          !isLiked &&
          (errorMsg.includes("already liked") ||
            errorMsg.includes("already exists"))
        )
          return
        if (
          isLiked &&
          (errorMsg.includes("not liked") || errorMsg.includes("not found"))
        )
          return

        throw new Error(res?.message || "Failed to like post")
      }
    } catch (error: any) {
      toast.error(error.message)

      // REVERT
      setLikedPosts((prev) => {
        const next = new Set(prev)
        if (isLiked) next.add(postId)
        else next.delete(postId)
        return next
      })

      setLocalPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const count = post._count?.likes || 0
            return {
              ...post,
              _count: {
                ...post._count,
                likes: isLiked ? count + 1 : Math.max(0, count - 1),
              },
            }
          }
          return post
        })
      )
    }
  }

  const handleToggleComments = async (postId: string) => {
    const isExpanded = !!expandedComments[postId]
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }))

    if (!isExpanded && !commentsData[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }))
      try {
        const comments = await getComments(postId)
        setCommentsData((prev) => ({
          ...prev,
          [postId]: Array.isArray(comments) ? comments : [],
        }))
      } catch (err) {
        toast.error("Failed to load comments")
      } finally {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }))
      }
    }
  }

  const handlePostComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }))
    const toastId = toast.loading("Posting comment...")

    const parentId = replyTargets[postId]?.id

    const res = await addComment(postId, text, parentId)
    if (res?.success) {
      toast.success("Comment added", { id: toastId })
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
      setReplyTargets((prev) => ({ ...prev, [postId]: null }))

      // Update comment count in the post
      setLocalPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  comments: (post._count?.comments || 0) + 1,
                },
              }
            : post
        )
      )

      // Append new comment instantly to the list
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
    } else {
      toast.error(res?.message || "Failed to post comment", { id: toastId })
    }

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: false }))
  }

  // Helper to neatly format the native ISO date
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

  const displayName = agency.agencyName || agency.name

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* 1. Hero Cover & Header */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          {/* Cover Image */}
          <div className="relative h-48 w-full overflow-hidden rounded-b-3xl bg-slate-100 md:h-72 dark:bg-slate-800">
            {agency.coverImage ? (
              <img
                src={agency.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-90" />
            )}
          </div>

          <div className="relative px-4 pb-8 sm:px-8">
            {/* Avatar & Action Buttons */}
            <div className="relative z-10 -mt-16 mb-4 flex flex-col gap-4 md:-mt-24 md:flex-row md:items-end md:justify-between">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md md:h-44 md:w-44 md:border-8 dark:border-slate-900 dark:bg-slate-800">
                {agency.profileImage ? (
                  <img
                    src={agency.profileImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-6xl font-black text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS: Message & Follow */}
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/messages/new?to=${agency.id}`}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-200 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  <Send className="h-4 w-4" /> Message
                </Link>

                <FollowButton
                  targetUserId={agency.id}
                  initialIsFollowing={initialIsFollowing}
                  variant="standard"
                  targetUserName={displayName}
                  onFollowChange={(isNowFollowing) => {
                    setFollowerCount((prev: number) =>
                      isNowFollowing ? prev + 1 : Math.max(0, prev - 1)
                    )
                  }}
                />
              </div>
            </div>

            {/* Agency Info */}
            <div className="max-w-3xl">
              <h1 className="flex items-center gap-2 text-3xl font-black text-slate-900 md:text-4xl dark:text-slate-100">
                {displayName}
                {agency.isVerified && (
                  <CheckCircle2 className="h-6 w-6 shrink-0 fill-blue-50 text-blue-500" />
                )}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                  <Star className="h-4 w-4 fill-orange-500" />
                  {agency.rating > 0
                    ? `${agency.rating} Average Rating`
                    : "No Ratings Yet"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {followerCount} Followers
                </span>
                {agency.website && (
                  <a
                    href={agency.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <Globe className="h-4 w-4" /> Website{" "}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {agency.bio || "This agency hasn't provided a bio yet."}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="hide-scrollbar flex w-full overflow-x-auto border-t border-slate-100 px-2 sm:px-8 dark:border-slate-800/50">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 px-1 py-3 text-[10px] font-bold whitespace-nowrap transition-colors sm:gap-2 sm:px-6 sm:py-4 sm:text-sm md:flex-none md:flex-row ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 sm:h-4 sm:w-4" />
                  <span className="flex items-center gap-1 truncate">
                    {tab.label}{" "}
                    <span className="font-medium opacity-60">
                      ({tab.count})
                    </span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="agency-tab-indicator"
                      className="absolute right-0 bottom-0 left-0 h-1 rounded-t-full bg-indigo-600 dark:bg-indigo-400"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. Tab Content Area */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* PACKAGES TAB */}
            {activeTab === "packages" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agency.packages?.length > 0 ? (
                  agency.packages.map((pkg: any) => (
                    <Link
                      key={pkg.id}
                      href={`/explore/${pkg.id}`}
                      className="group block"
                    >
                      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                          {pkg.images?.[0] && (
                            <img
                              src={pkg.images[0]}
                              alt={pkg.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-slate-100">
                            ৳{pkg.price}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100">
                            {pkg.title}
                          </h3>
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5" /> {pkg.destination}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    icon={Map}
                    title="No packages yet"
                    desc="This agency hasn't published any trips."
                  />
                )}
              </div>
            )}

            {/* POSTS TAB (With Like & Comment Functionality) */}
            {activeTab === "posts" && (
              <div className="mx-auto flex max-w-2xl flex-col gap-6">
                {localPosts.length > 0 ? (
                  localPosts.map((post: any) => (
                    <article
                      key={post.id}
                      className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      {/* Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-indigo-900 font-bold text-white shadow-sm dark:border-slate-700">
                            {agency.profileImage ? (
                              <img
                                src={agency.profileImage}
                                alt={displayName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {displayName}
                              </h4>
                              {agency.isVerified && (
                                <CheckCircle2
                                  className="h-4 w-4 text-blue-500"
                                  fill="currentColor"
                                />
                              )}
                            </div>
                            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              {formatTime(post.createdAt)}{" "}
                              {post.location && (
                                <>
                                  <MapPin className="ml-1 inline h-3 w-3" />{" "}
                                  {post.location}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <button className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                        {post.content}
                      </p>

                      {/* Dynamic Image Grid */}
                      {post.images && post.images.length > 0 && (
                        <div
                          className={`mb-4 grid gap-2 ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                        >
                          {post.images.map((img: string, idx: number) => (
                            <div
                              key={idx}
                              className={`h-64 overflow-hidden rounded-2xl bg-slate-100 sm:h-80 dark:bg-slate-800 ${
                                post.images.length > 1 && idx === 0
                                  ? "rounded-r-none"
                                  : post.images.length > 1 && idx === 1
                                    ? "rounded-l-none"
                                    : ""
                              }`}
                            >
                              <img
                                src={img}
                                alt="Post Media"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Unified Action Bar */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/50">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleToggleLike(post.id)}
                            className={`group flex cursor-pointer items-center gap-2 transition-colors ${likedPosts.has(post.id) ? "text-rose-600" : "text-slate-500 hover:text-rose-600"}`}
                          >
                            <Heart
                              className="h-5 w-5 transition-transform group-hover:scale-110"
                              fill={
                                likedPosts.has(post.id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span className="text-sm font-medium">
                              {post._count?.likes || 0}
                            </span>
                          </button>
                          <button
                            onClick={() => handleToggleComments(post.id)}
                            className={`group flex cursor-pointer items-center gap-2 transition-colors ${expandedComments[post.id] ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"}`}
                          >
                            <MessageCircle
                              className="h-5 w-5 transition-transform group-hover:scale-110"
                              fill={
                                expandedComments[post.id]
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span className="text-sm font-medium">
                              {post._count?.comments || 0}
                            </span>
                          </button>
                          <button className="cursor-pointer text-slate-500 transition-colors hover:text-indigo-600">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                        <button className="cursor-pointer text-slate-500 transition-colors hover:text-indigo-900">
                          <Bookmark className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Expandable Comments Section */}
                      {expandedComments[post.id] && (
                        <div className="mt-4 flex animate-in flex-col gap-4 border-t border-slate-100 pt-4 duration-200 fade-in slide-in-from-top-2 dark:border-slate-800">
                          {loadingComments[post.id] ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                            </div>
                          ) : commentsData[post.id]?.length === 0 ? (
                            <p className="rounded-xl bg-slate-50 py-2 text-center text-xs text-slate-500 dark:bg-slate-800/30">
                              No comments yet. Start the conversation!
                            </p>
                          ) : (
                            <div className="custom-scrollbar flex max-h-60 flex-col gap-3 overflow-y-auto pr-2">
                              {(
                                commentsData[post.id]?.filter(
                                  (c) => !c.parentId
                                ) || []
                              ).map((rootComment: any) => (
                                <div
                                  key={rootComment.id}
                                  className="flex flex-col gap-2"
                                >
                                  {/* Root Comment Container */}
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
                                              [post.id]: {
                                                id: rootComment.id,
                                                name:
                                                  rootComment.user?.name ||
                                                  "User",
                                              },
                                            }))
                                          }
                                          className="cursor-pointer text-[10px] font-bold text-slate-400 transition-colors hover:text-indigo-600"
                                        >
                                          Reply
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Child Replies */}
                                  {(
                                    commentsData[post.id]?.filter(
                                      (child) =>
                                        child.parentId === rootComment.id
                                    ) || []
                                  ).map((reply: any) => (
                                    <div
                                      key={reply.id}
                                      className="relative flex gap-2.5 py-1 pr-2 pl-10"
                                    >
                                      {/* Small L curve to show nesting visually */}
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
                                                [post.id]: {
                                                  id: rootComment.id,
                                                  name:
                                                    reply.user?.name || "User",
                                                },
                                              }))
                                            }
                                            className="cursor-pointer text-[10px] font-bold text-slate-400 transition-colors hover:text-indigo-600"
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
                            {replyTargets[post.id] && (
                              <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 dark:border-indigo-800 dark:bg-indigo-900/30">
                                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                  Replying to @{replyTargets[post.id]?.name}
                                </span>
                                <button
                                  onClick={() =>
                                    setReplyTargets((prev) => ({
                                      ...prev,
                                      [post.id]: null,
                                    }))
                                  }
                                  className="cursor-pointer text-xs font-bold text-indigo-400 hover:text-indigo-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={
                                  replyTargets[post.id]
                                    ? `Write a reply...`
                                    : `Write a comment...`
                                }
                                value={commentInputs[post.id] || ""}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  handlePostComment(post.id)
                                }
                                className="flex-1 rounded-full border-none bg-slate-100 px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:bg-slate-800 dark:text-slate-200"
                                disabled={isSubmittingComment[post.id]}
                              />
                              <button
                                onClick={() => handlePostComment(post.id)}
                                disabled={
                                  !commentInputs[post.id]?.trim() ||
                                  isSubmittingComment[post.id]
                                }
                                className="shrink-0 cursor-pointer rounded-full bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                              >
                                {isSubmittingComment[post.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="-ml-0.5 h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <EmptyState
                    icon={Grid}
                    title="No posts yet"
                    desc="This agency hasn't shared any updates."
                  />
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="flex max-w-3xl flex-col gap-4">
                {agency.reviewsReceived?.length > 0 ? (
                  agency.reviewsReceived.map((review: any) => (
                    <div
                      key={review.id}
                      className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                        {review.traveler?.name?.charAt(0) || "T"}
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">
                            {review.traveler?.name || "Traveler"}
                          </h4>
                          <div className="ml-2 flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-orange-400 text-orange-400" : "text-slate-200 dark:text-slate-700"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={MessageSquare}
                    title="No reviews yet"
                    desc="Travelers haven't reviewed this agency yet."
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Reusable Empty State Component
function EmptyState({
  icon: Icon,
  title,
  desc,
}: {
  icon: any
  title: string
  desc: string
}) {
  return (
    <div className="col-span-full rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
      <Icon className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1 text-slate-500">{desc}</p>
    </div>
  )
}
