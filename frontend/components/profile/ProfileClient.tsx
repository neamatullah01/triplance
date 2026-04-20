"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Edit3, Grid, Map, Star, ShieldCheck, Plus } from "lucide-react";
import { CreatePostModal } from "@/components/feed/CreatePostModal";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProfileClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "bookings", label: "Journeys", icon: Map },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  const joinedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* 1. Cover Photo & Header Profile Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          
          {/* Cover Image (Gradient fallback if none) */}
          <div className="h-48 md:h-64 w-full relative bg-slate-100 dark:bg-slate-800 rounded-b-3xl overflow-hidden">
            {user?.coverImage ? (
              <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            )}
          </div>

          <div className="px-4 sm:px-8 pb-8 relative">
            {/* Avatar & Action Buttons */}
            <div className="flex justify-between items-end -mt-16 md:-mt-20 mb-4 relative z-10">
              
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-md">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-black text-5xl">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mb-2 md:mb-6">
                <CreatePostModal 
                  customTrigger={
                    <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/20 cursor-pointer">
                      <Plus className="h-4 w-4" /> Create Post
                    </button>
                  } 
                />
                <button className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </button>
              </div>

            </div>

            {/* User Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {user?.name || "Explorer"}
                {user?.isVerified && <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0" />}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Earth</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Joined {joinedDate}</span>
              </div>

              <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {user?.bio || "This traveler hasn't written a bio yet. They are probably too busy exploring the world!"}
              </p>

              {/* Stats */}
              <div className="flex gap-6 mt-6">
                <div className="flex gap-1.5 cursor-pointer hover:underline decoration-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user?.followingCount || 0}</span>
                  <span className="text-slate-500">Following</span>
                </div>
                <div className="flex gap-1.5 cursor-pointer hover:underline decoration-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user?.followersCount || 0}</span>
                  <span className="text-slate-500">Followers</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar px-4 sm:px-8 border-t border-slate-100 dark:border-slate-800/50">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="profile-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Content Area based on Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === "posts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add your post cards here. For now, empty state: */}
              <motion.div variants={itemVariants} className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <Grid className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No posts yet</h3>
                <p className="text-slate-500">Share your first travel memory!</p>
              </motion.div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <Map className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No journeys</h3>
                <p className="text-slate-500">You haven't booked any packages yet.</p>
              </motion.div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <Star className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No reviews</h3>
                <p className="text-slate-500">Review your trips after you complete them.</p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

    </div>
  );
}