"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Edit3, Grid, Map, Star, ShieldCheck, Plus, Heart, MessageCircle } from "lucide-react";
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

export function ProfileClient({ user, initialPosts = [] }: { user: any, initialPosts?: any[] }) {
  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "bookings", label: "Journeys", icon: Map },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  const joinedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  // Helper to nicely format time
  const formatTime = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedLikes, setExpandedLikes] = useState<Record<string, boolean>>({});

  const handleToggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleToggleLikes = (postId: string) => {
    setExpandedLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

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
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              {initialPosts && initialPosts.length > 0 ? (
                initialPosts.map((post) => (
                  <motion.article 
                    variants={itemVariants} 
                    key={post.id} 
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 shrink-0">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(post.createdAt)} {post.location && ` • ${post.location}`}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.images && post.images.length > 0 && (
                      <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.images.map((img: string, idx: number) => (
                          <div key={idx} className={`h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 overflow-hidden ${
                            post.images.length === 1 ? 'rounded-2xl' : 
                            idx === 0 ? 'rounded-l-2xl rounded-r-sm' : 
                            idx === 1 ? 'rounded-r-2xl rounded-l-sm' : 'rounded-xl'
                          }`}>
                            <img src={img} alt="Post Media" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Unified Action Bar style from MainFeed */}
                    <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-6">
                        <button onClick={() => handleToggleLikes(post.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group ${expandedLikes[post.id] ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>
                          <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" fill={expandedLikes[post.id] ? "currentColor" : "none"} /> 
                          <span className="text-sm font-medium">{post._count?.likes || 0}</span>
                        </button>
                        <button onClick={() => handleToggleComments(post.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group ${expandedComments[post.id] ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                          <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" fill={expandedComments[post.id] ? "currentColor" : "none"} /> 
                          <span className="text-sm font-medium">{post._count?.comments || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable LIKES Section View */}
                    {expandedLikes[post.id] && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liked By</span>
                        {post.likes && post.likes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                             {post.likes.map((like: any) => (
                               <div key={like.id} className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-100 dark:border-rose-900/30">
                                 <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-600 shrink-0">
                                    {like.user?.profileImage ? (
                                      <img src={like.user.profileImage} alt={like.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{like.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                                    )}
                                 </div>
                                 <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">{like.user?.name || "Traveler"}</span>
                               </div>
                             ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">No likes yet.</p>
                        )}
                      </div>
                    )}

                    {/* Expandable COMMENTS Section View */}
                    {expandedComments[post.id] && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {(!post.comments || post.comments.length === 0) ? (
                          <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">No comments yet. Start the conversation!</p>
                        ) : (
                          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {(post.comments.filter((c: any) => !c.parentId)).map((rootComment: any) => (
                              <div key={rootComment.id} className="flex flex-col gap-2">
                                {/* Root Comment Container */}
                                <div className="flex gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-600">
                                    {rootComment.user?.profileImage ? (
                                      <img src={rootComment.user.profileImage} alt={rootComment.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{rootComment.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{rootComment.user?.name || "Traveler"}</span>
                                      <span className="text-[10px] text-slate-400">{formatTime(rootComment.createdAt)}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 break-words">
                                      {rootComment.text || rootComment.content || rootComment.textcontent}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Child Replies */}
                                {(post.comments.filter((child: any) => child.parentId === rootComment.id)).map((reply: any) => (
                                  <div key={reply.id} className="flex gap-2.5 pl-10 pr-2 py-1 relative">
                                    {/* Small L curve to show nesting visually */}
                                    <div className="absolute left-6 top-0 bottom-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="absolute left-6 bottom-4 w-3 h-px bg-slate-200 dark:bg-slate-700"></div>
                                    
                                    <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0 flex items-center justify-center overflow-hidden z-10 border border-slate-100 dark:border-slate-600">
                                      {reply.user?.profileImage ? (
                                        <img src={reply.user.profileImage} alt={reply.user.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{reply.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                                      )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{reply.user?.name || "Traveler"}</span>
                                        <span className="text-[10px] text-slate-400">{formatTime(reply.createdAt)}</span>
                                      </div>
                                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 break-words">
                                        {reply.text || reply.content || reply.textcontent}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.article>
                ))
              ) : (
                <motion.div variants={itemVariants} className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <Grid className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No posts yet</h3>
                  <p className="text-slate-500">Share your first travel memory!</p>
                </motion.div>
              )}
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