"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  CalendarDays,
  Edit3,
  Grid,
  Map,
  Star,
  ShieldCheck,
  Plus,
  Compass,
  Bookmark,
  Settings,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  Loader2,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react"

import { CreatePostModal } from "@/components/feed/CreatePostModal"
import { EditProfileModal } from "./EditProfileModal"
import { MyReviewsTab } from "./MyReviewsTab"
import { FollowButton } from "@/components/shared/FollowButton"
import Link from "next/link"
import { toast } from "sonner"

import { likePost, unlikePost } from "@/services/like.service"
import { getComments, addComment } from "@/services/comment.service"
import { deletePost } from "@/services/post.service"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function ProfileClient({
  user,
  initialPosts = [],
}: {
  user: any
  initialPosts?: any[]
}) {
  const [localUser, setLocalUser] = useState(user)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [posts, setPosts] = useState<any[]>(initialPosts)

  // --- Inline Post States (Same as MainFeed) ---
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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const confirmDeletePost = (postId: string) => {
    setActiveDropdown(null)
    toast("Delete this post?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const toastId = toast.loading("Deleting post...")
          try {
            const res = await deletePost(postId, localUser.id)
            if (res?.success) {
              setPosts((prev) => prev.filter((p) => p.id !== postId))
              toast.success("Post deleted successfully", { id: toastId })
            } else {
              toast.error(res?.message || "Failed to delete post", { id: toastId })
            }
          } catch (error) {
            toast.error("An error occurred while deleting", { id: toastId })
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => console.log("Cancelled delete"),
      },
    })
  }

  // Initialize posts and likes
  useEffect(() => {
    setPosts(initialPosts)
    setLikedPosts((prevLikes) => {
      const updated = new Set(prevLikes)
      initialPosts.forEach((item: any) => {
        if (item.isLiked || (item.likes && item.likes.length > 0)) {
          updated.add(item.id)
        }
      })
      return updated
    })
  }, [initialPosts])

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "bookings", label: "Journeys", icon: Map },
    { id: "discover", label: "Discover", icon: Compass },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const joinedDate = localUser?.createdAt
    ? new Date(localUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently"

  const handleProfileUpdate = (updatedData: any) => {
    setLocalUser((prev: any) => ({ ...prev, ...updatedData }))
  }

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
    return date.toLocaleDateString("en-US")
  }

  // --- Post Action Handlers ---
  const handleToggleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId)
    setLikedPosts((prev) => {
      const next = new Set(prev)
      if (isLiked) next.delete(postId)
      else next.add(postId)
      return next
    })

    setPosts((prev) =>
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

    if (isLiked) {
      const res = await unlikePost(postId)
      if (!res?.success) toast.error(res?.message || "Failed to unlike post")
    } else {
      const res = await likePost(postId)
      if (!res?.success) toast.error(res?.message || "Failed to like post")
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

      setPosts((prev) =>
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
        user: {
          name: localUser?.name || "You",
          profileImage: localUser?.profileImage,
        },
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

  // --- Smart Image Grid Helper ---
  const renderImageGrid = (images: string[]) => {
    if (!images || images.length === 0) return null

    const openLightbox = (index: number) => {
      setLightbox({ isOpen: true, images, currentIndex: index })
    }

    if (images.length === 1) {
      return (
        <div
          onClick={() => openLightbox(0)}
          className="mb-4 h-64 w-full cursor-pointer overflow-hidden rounded-2xl sm:h-96"
        >
          <img
            src={images[0]}
            alt="Post Media"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )
    }

    if (images.length === 2) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
          <div
            onClick={() => openLightbox(0)}
            className="aspect-[4/5] w-full cursor-pointer"
          >
            <img
              src={images[0]}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div
            onClick={() => openLightbox(1)}
            className="aspect-[4/5] w-full cursor-pointer"
          >
            <img
              src={images[1]}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
            className="col-span-2 aspect-[2/1] w-full cursor-pointer"
          >
            <img
              src={images[0]}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div
            onClick={() => openLightbox(1)}
            className="aspect-square w-full cursor-pointer"
          >
            <img
              src={images[1]}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div
            onClick={() => openLightbox(2)}
            className="aspect-square w-full cursor-pointer"
          >
            <img
              src={images[2]}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      )
    }

    return (
      <div className="mb-4 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
        <div
          onClick={() => openLightbox(0)}
          className="aspect-square w-full cursor-pointer"
        >
          <img
            src={images[0]}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div
          onClick={() => openLightbox(1)}
          className="aspect-square w-full cursor-pointer"
        >
          <img
            src={images[1]}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div
          onClick={() => openLightbox(2)}
          className="aspect-square w-full cursor-pointer"
        >
          <img
            src={images[2]}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* 1. Cover Photo & Header Profile Section */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="relative h-48 w-full overflow-hidden rounded-b-3xl bg-slate-100 md:h-64 dark:bg-slate-800">
            {localUser?.coverImage ? (
              <img
                src={localUser.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            )}
          </div>

          <div className="relative px-4 pb-8 sm:px-8">
            <div className="relative z-10 -mt-16 mb-4 flex items-end justify-between md:-mt-20">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md md:h-40 md:w-40 md:border-8 dark:border-slate-900 dark:bg-slate-800">
                {localUser?.profileImage ? (
                  <img
                    src={localUser.profileImage}
                    alt={localUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-5xl font-black text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                    {localUser?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="mb-2 flex gap-3 md:mb-6">
                <CreatePostModal
                  customTrigger={
                    <button className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700">
                      <Plus className="h-4 w-4" /> Create Post
                    </button>
                  }
                />
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-5 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </button>
              </div>
            </div>

            <div>
              <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900 md:text-3xl dark:text-slate-100">
                {localUser?.name || "Explorer"}
                {localUser?.isVerified && (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-blue-500" />
                )}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Earth
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> Joined {joinedDate}
                </span>
              </div>

              <p className="mt-4 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300">
                {localUser?.bio || "This traveler hasn't written a bio yet."}
              </p>

              <div className="mt-6 flex gap-6">
                <div className="flex cursor-pointer gap-1.5 decoration-slate-300 hover:underline">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {localUser?.followingCount || 0}
                  </span>
                  <span className="text-slate-500">Following</span>
                </div>
                <div className="flex cursor-pointer gap-1.5 decoration-slate-300 hover:underline">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {localUser?.followersCount || 0}
                  </span>
                  <span className="text-slate-500">Followers</span>
                </div>
              </div>
            </div>
          </div>

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
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="profile-tab-indicator"
                      className="absolute right-0 bottom-0 left-0 h-1 rounded-t-full bg-indigo-600 dark:bg-indigo-400"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-8">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === "posts" && (
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              {posts && posts.length > 0 ? (
                posts.map((item) => (
                  <motion.article
                    key={item.id}
                    variants={itemVariants}
                    className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    {item.feedType === "PACKAGE" ? (
                      /* --- PACKAGE TIMELINE CARD --- */
                      <>
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-indigo-900 font-bold text-white shadow-sm dark:border-slate-700">
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
                                <CheckCircle2
                                  className="h-4 w-4 text-blue-500"
                                  fill="currentColor"
                                />
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

                        {/* ✅ SMART IMAGE GRID FOR PACKAGE */}
                        {renderImageGrid(item.images)}

                        <h3 className="mb-2 truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                          {item.content?.split("\n\n")[0] ||
                            "Exclusive Tour Package"}
                        </h3>
                        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {item.content?.split("\n\n")[1] || item.content}
                        </p>

                        <button className="w-full cursor-pointer rounded-xl bg-rose-800 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-900">
                          View Expedition Details
                        </button>
                      </>
                    ) : (
                      /* --- TRAVELER POST TIMELINE CARD --- */
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
                                    ? item.author.name
                                        .substring(0, 1)
                                        .toUpperCase()
                                    : "U"}
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {item.author?.name || "Traveler"}
                              </h4>
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
                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                              className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            
                            <AnimatePresence>
                              {activeDropdown === item.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.1 }}
                                  className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg z-50 dark:border-slate-800 dark:bg-slate-900"
                                >
                                  <button
                                    onClick={() => confirmDeletePost(item.id)}
                                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                  >
                                    <Trash2 className="h-4 w-4" /> Delete Post
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                          {item.content}
                        </p>

                        {/* ✅ SMART IMAGE GRID FOR TRAVELER POST */}
                        {renderImageGrid(item.images)}
                      </>
                    )}

                    {/* Unified Action Bar (Applies to both PACKAGE and POST) */}
                    <div
                      className={`mt-4 flex items-center justify-between pt-3 ${item.feedType === "PACKAGE" ? "border-t border-slate-100 dark:border-slate-800/50" : ""}`}
                    >
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleToggleLike(item.id)}
                          className={`group flex cursor-pointer items-center gap-2 transition-colors ${likedPosts.has(item.id) ? "text-rose-600" : "text-slate-500 hover:text-rose-600"}`}
                        >
                          <Heart
                            className="h-5 w-5 transition-transform group-hover:scale-110"
                            fill={
                              likedPosts.has(item.id) ? "currentColor" : "none"
                            }
                          />
                          <span className="text-sm font-medium">
                            {item._count?.likes || 0}
                          </span>
                        </button>
                        <button
                          onClick={() => handleToggleComments(item.id)}
                          className={`group flex cursor-pointer items-center gap-2 transition-colors ${expandedComments[item.id] ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"}`}
                        >
                          <MessageCircle
                            className="h-5 w-5 transition-transform group-hover:scale-110"
                            fill={
                              expandedComments[item.id]
                                ? "currentColor"
                                : "none"
                            }
                          />
                          <span className="text-sm font-medium">
                            {item._count?.comments || 0}
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
                    {expandedComments[item.id] && (
                      <div className="mt-4 flex animate-in flex-col gap-4 border-t border-slate-100 pt-4 duration-200 fade-in slide-in-from-top-2 dark:border-slate-800">
                        {loadingComments[item.id] ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                          </div>
                        ) : commentsData[item.id]?.length === 0 ? (
                          <p className="rounded-xl bg-slate-50 py-2 text-center text-xs text-slate-500 dark:bg-slate-800/30">
                            No comments yet. Start the conversation!
                          </p>
                        ) : (
                          <div className="custom-scrollbar flex max-h-60 flex-col gap-3 overflow-y-auto pr-2">
                            {(
                              commentsData[item.id]?.filter(
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
                                            [item.id]: {
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
                                  commentsData[item.id]?.filter(
                                    (child) => child.parentId === rootComment.id
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
                                              [item.id]: {
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
                          {replyTargets[item.id] && (
                            <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 dark:border-indigo-800 dark:bg-indigo-900/30">
                              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                Replying to @{replyTargets[item.id]?.name}
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
                                Cancel
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
                                e.key === "Enter" && handlePostComment(item.id)
                              }
                              className="flex-1 rounded-full border-none bg-slate-100 px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:bg-slate-800 dark:text-slate-200"
                              disabled={isSubmittingComment[item.id]}
                            />
                            <button
                              onClick={() => handlePostComment(item.id)}
                              disabled={
                                !commentInputs[item.id]?.trim() ||
                                isSubmittingComment[item.id]
                              }
                              className="shrink-0 cursor-pointer rounded-full bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
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
                    )}
                  </motion.article>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800"
                >
                  <Grid className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    No posts yet
                  </h3>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="flex flex-col gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800"
              >
                <Map className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  No journeys
                </h3>
                <p className="text-slate-500">
                  You haven't booked any packages yet.
                </p>
              </motion.div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              <MyReviewsTab />
            </div>
          )}

          {activeTab === "discover" && (
            <div className="flex flex-col gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800"
              >
                <Compass className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Discover
                </h3>
                <p className="text-slate-500">
                  Find new places and agencies to explore.
                </p>
              </motion.div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="flex flex-col gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800"
              >
                <Bookmark className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  No saved items
                </h3>
                <p className="text-slate-500">
                  Save your favorite posts and packages here.
                </p>
              </motion.div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex flex-col gap-4">
              <motion.div
                variants={itemVariants}
                className="rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800"
              >
                <Settings className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Settings
                </h3>
                <p className="text-slate-500">
                  Manage your account preferences here.
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={localUser}
        onProfileUpdate={handleProfileUpdate}
      />

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
