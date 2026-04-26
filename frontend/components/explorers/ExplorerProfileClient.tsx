"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  CalendarDays,
  ShieldCheck,
  Grid,
  Star,
  Users,
  ArrowLeft,
  Mail,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Compass,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"
import { FollowButton } from "@/components/shared/FollowButton"
import { likePost, unlikePost } from "@/services/like.service"
import { getComments, addComment } from "@/services/comment.service"
import { toast } from "sonner"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

interface ExplorerProfileClientProps {
  explorer: any
  currentUserId: string | null
  initialIsFollowing: boolean
}

export function ExplorerProfileClient({
  explorer,
  currentUserId,
  initialIsFollowing,
}: ExplorerProfileClientProps) {
  const [followerCount, setFollowerCount] = useState<number>(
    explorer._count?.followers ?? 0
  )
  const isOwnProfile = currentUserId === explorer.id

  const joinedDate = explorer.createdAt
    ? new Date(explorer.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently"

  const [posts, setPosts] = useState<any[]>(explorer.posts ?? [])

  // Post Interaction State
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [commentsData, setCommentsData] = useState<Record<string, any[]>>({})
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({})
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({})
  const [replyTargets, setReplyTargets] = useState<Record<string, { id: string; name: string } | null>>({})

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean
    images: string[]
    currentIndex: number
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  })

  useEffect(() => {
    // Initialize liked posts
    const initialLikes = new Set<string>()
    posts.forEach((post) => {
      if (post.isLiked || (post.likes && post.likes.length > 0)) {
        initialLikes.add(post.id)
      }
    })
    setLikedPosts(initialLikes)
  }, [explorer.posts])

  const formatTime = (dateString: string) => {
    if (!dateString) return "Just now"
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

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

      setPosts((prev) =>
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

  const handleToggleComments = async (postId: string) => {
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

  const handlePostComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }))
    const toastId = toast.loading("Posting comment...")

    const parentId = replyTargets[postId]?.id

    try {
      const res = await addComment(postId, text, parentId)

      if (!res?.success) throw new Error(res?.message || "Failed to post comment")

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
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className="group aspect-[4/5] w-full cursor-pointer overflow-hidden"
            >
              <img
                src={img}
                alt="Post Media"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
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
              alt="Post Media"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {images.slice(1).map((img, i) => (
            <div
              key={i + 1}
              onClick={() => openLightbox(i + 1)}
              className="group aspect-square w-full cursor-pointer overflow-hidden"
            >
              <img
                src={img}
                alt="Post Media"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="mb-4 grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl sm:gap-2">
        {images.slice(0, 3).map((img, i) => (
          <div
            key={i}
            onClick={() => openLightbox(i)}
            className="group aspect-square w-full cursor-pointer overflow-hidden"
          >
            <img
              src={img}
              alt="Post Media"
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
            alt="Post Media"
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
      {/* Back nav */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-2xl lg:max-w-5xl px-4 py-3 sm:px-6">
          <Link
            href="/explorers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explorers
          </Link>
        </div>
      </div>

      {/* Cover + Profile Header */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          {/* Cover */}
          <div className="relative h-44 w-full overflow-hidden rounded-b-3xl bg-slate-100 md:h-60 dark:bg-slate-800">
            {explorer.coverImage ? (
              <img
                src={explorer.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            )}
          </div>

          {/* Info row */}
          <div className="relative px-4 pb-8 sm:px-8">
            <div className="relative z-10 -mt-14 mb-4 flex flex-col gap-4 md:-mt-16 md:flex-row md:items-end md:justify-between">
              {/* Avatar */}
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md md:h-36 md:w-36 md:border-[6px] dark:border-slate-900 dark:bg-slate-800">
                {explorer.profileImage ? (
                  <img
                    src={explorer.profileImage}
                    alt={explorer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-4xl font-black text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                    {explorer.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Action */}
              {!isOwnProfile && (
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/messages/new?to=${explorer.id}`}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-200 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    <Send className="h-4 w-4" /> Message
                  </Link>

                  <FollowButton
                    targetUserId={explorer.id}
                    targetUserName={explorer.name}
                    initialIsFollowing={initialIsFollowing}
                    variant="standard"
                    onFollowChange={(isNow) =>
                      setFollowerCount((c) => (isNow ? c + 1 : Math.max(0, c - 1)))
                    }
                  />
                </div>
              )}
            </div>

            {/* Name & Meta */}
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900 md:text-3xl dark:text-slate-100">
                {explorer.name}
                {explorer.isVerified && (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-blue-500" />
                )}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                    explorer.role === "AGENCY"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  }`}
                >
                  {explorer.role === "AGENCY" ? "Travel Agency" : "Explorer"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> Joined {joinedDate}
                </span>
                {explorer.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {explorer.email}
                  </span>
                )}
              </div>

              {explorer.bio && (
                <p className="mt-4 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300">
                  {explorer.bio}
                </p>
              )}

              {/* Stats */}
              <div className="mt-6 flex gap-6">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {explorer._count?.following ?? 0}
                  </span>{" "}
                  <span className="text-sm text-slate-500">Following</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {followerCount}
                  </span>{" "}
                  <span className="text-sm text-slate-500">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {explorer._count?.posts ?? 0}
                  </span>{" "}
                  <span className="text-sm text-slate-500">Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts / empty state */}
      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <Grid className="h-4 w-4" />
          Posts
        </div>

        {posts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {posts.map((post: any) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:rounded-3xl sm:p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-100 bg-slate-200 dark:border-slate-700 dark:bg-slate-800">
                      {explorer.profileImage ? (
                        <img
                          src={explorer.profileImage}
                          alt={explorer.name || "User Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-200 font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {explorer.name ? explorer.name.substring(0, 1).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {explorer.name || "Traveler"}
                        </h4>
                        {explorer.isVerified && (
                          <ShieldCheck className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        {formatTime(post.createdAt)}
                        {post.location && (
                          <>
                            <MapPin className="ml-1 inline h-3 w-3" /> {post.location}
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
                  {post.content}
                </p>

                {renderImageGrid(post.images)}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/50">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`group flex cursor-pointer items-center gap-2 transition-colors active:scale-90 ${likedPosts.has(post.id) ? "text-rose-600" : "text-slate-500 hover:text-rose-600"}`}
                    >
                      <Heart
                        className="h-5 w-5 transition-transform group-hover:scale-110"
                        fill={likedPosts.has(post.id) ? "currentColor" : "none"}
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
                        fill={expandedComments[post.id] ? "currentColor" : "none"}
                      />
                      <span className="text-sm font-medium">
                        {post._count?.comments || 0}
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

                <AnimatePresence>
                  {expandedComments[post.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                        {loadingComments[post.id] ? (
                          <div className="flex items-center justify-center py-4">
                            <Compass className="h-6 w-6 animate-spin text-indigo-500" />
                          </div>
                        ) : commentsData[post.id]?.length === 0 ? (
                          <p className="rounded-xl bg-slate-50 py-2 text-center text-xs text-slate-500 italic dark:bg-slate-800/30">
                            No comments yet. Start the conversation!
                          </p>
                        ) : (
                          <div className="custom-scrollbar flex max-h-60 flex-col gap-3 overflow-y-auto pr-2">
                            {(commentsData[post.id]?.filter((c) => !c.parentId) || []).map((rootComment: any) => (
                              <div key={rootComment.id} className="flex flex-col gap-2">
                                <div className="flex gap-2.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-200 dark:border-slate-600 dark:bg-slate-700">
                                    {rootComment.user?.profileImage ? (
                                      <img
                                        src={rootComment.user.profileImage}
                                        alt={rootComment.user.name || "User Avatar"}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        {rootComment.user?.name?.charAt(0).toUpperCase() || "U"}
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
                                      {rootComment.text || rootComment.content || rootComment.textcontent}
                                    </p>
                                    <div className="mt-1.5 flex items-center gap-3 pt-0.5">
                                      <button
                                        onClick={() =>
                                          setReplyTargets((prev) => ({
                                            ...prev,
                                            [post.id]: {
                                              id: rootComment.id,
                                              name: rootComment.user?.name || "User",
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

                                {(commentsData[post.id]?.filter((child) => child.parentId === rootComment.id) || []).map((reply: any) => (
                                  <div key={reply.id} className="relative flex gap-2.5 py-1 pr-2 pl-10">
                                    <div className="absolute top-0 bottom-4 left-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="absolute bottom-4 left-6 h-px w-3 bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-200 dark:border-slate-600 dark:bg-slate-700">
                                      {reply.user?.profileImage ? (
                                        <img
                                          src={reply.user.profileImage}
                                          alt={reply.user.name || "User Avatar"}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                          {reply.user?.name?.charAt(0).toUpperCase() || "U"}
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
                                        {reply.text || reply.content || reply.textcontent}
                                      </p>
                                      <div className="mt-1.5 flex items-center gap-3 pt-0.5">
                                        <button
                                          onClick={() =>
                                            setReplyTargets((prev) => ({
                                              ...prev,
                                              [post.id]: {
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

                        <div className="mt-2 flex flex-col gap-2">
                          {replyTargets[post.id] && (
                            <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 dark:border-indigo-800 dark:bg-indigo-900/30">
                              <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                                Replying to <b>@{replyTargets[post.id]?.name}</b>
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
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={
                                replyTargets[post.id] ? `Write a reply...` : `Write a comment...`
                              }
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handlePostComment(post.id)
                              }
                              className="flex-1 rounded-full border-none bg-slate-100 px-4 py-2.5 text-sm text-slate-800 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:bg-slate-800 dark:text-slate-200"
                              disabled={isSubmittingComment[post.id]}
                            />
                            <button
                              onClick={() => handlePostComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim() || isSubmittingComment[post.id]}
                              className="shrink-0 cursor-pointer rounded-full bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale"
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800"
          >
            <Grid className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No posts yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {explorer.name} hasn't shared anything yet.
            </p>
          </motion.div>
        )}
      </div>

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
                      (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length,
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
              alt="Fullscreen Media"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {lightbox.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox({
                    ...lightbox,
                    currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length,
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
