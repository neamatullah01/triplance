"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { FollowButton } from "@/components/shared/FollowButton"

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

  const posts: any[] = explorer.posts ?? []

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Back nav */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
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
        <div className="mx-auto max-w-5xl">
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
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
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
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {post.content}
                </p>
                {post.images?.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 overflow-hidden rounded-2xl">
                    {post.images.slice(0, 4).map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        alt="Post"
                        className="h-40 w-full object-cover"
                      />
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    {post._count?.likes ?? 0} likes
                  </span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
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
    </div>
  )
}
