"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CalendarDays, Edit3, Grid, Map, Star, ShieldCheck, Plus, Heart, MessageCircle, X, Loader2, Send, Compass, Bookmark, Settings } from "lucide-react";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { EditProfileModal } from "./EditProfileModal"; // <-- Import the new modal
import { getComments, addComment } from "@/services/comment.service";
import { toast } from "sonner";

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
  // Local state for optimistic UI updates after editing profile
  const [localUser, setLocalUser] = useState(user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "bookings", label: "Journeys", icon: Map },
    { id: "discover", label: "Discover", icon: Compass },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const joinedDate = localUser?.createdAt 
    ? new Date(localUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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

  const [posts, setPosts] = useState<any[]>(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  
  const [commentsData, setCommentsData] = useState<Record<string, any[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [replyTargets, setReplyTargets] = useState<Record<string, { id: string, name: string } | null>>({});
  const [modalLikesOpen, setModalLikesOpen] = useState<string | null>(null);

  const handleToggleComments = async (postId: string) => {
    const isExpanded = !!expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded && !commentsData[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      try {
        const comments = await getComments(postId);
        setCommentsData(prev => ({ ...prev, [postId]: Array.isArray(comments) ? comments : [] }));
      } catch (err) {
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handlePostComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    const toastId = toast.loading("Posting comment...");
    
    const parentId = replyTargets[postId]?.id;

    const res = await addComment(postId, text, parentId);
    if (res?.success) {
      toast.success("Comment added", { id: toastId });
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      setReplyTargets(prev => ({ ...prev, [postId]: null }));
      
      setPosts((prev) => prev.map(item => item.id === postId ? { ...item, _count: { ...item._count, comments: (item._count?.comments || 0) + 1 }} : item));

      const newComment = res.data || { id: Math.random().toString(), content: text, parentId, createdAt: new Date().toISOString(), user: { name: localUser?.name || "You", profileImage: localUser?.profileImage } };
      setCommentsData(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    } else {
      toast.error(res?.message || "Failed to post comment", { id: toastId });
    }
    
    setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
  };

  const handleToggleLikes = (postId: string) => {
    setModalLikesOpen(postId);
  };

  // Handler to update the local user state after edit profile success
  const handleProfileUpdate = (updatedData: any) => {
    setLocalUser((prev: any) => ({ ...prev, ...updatedData }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* 1. Cover Photo & Header Profile Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          
          {/* Cover Image (Gradient fallback if none) */}
          <div className="h-48 md:h-64 w-full relative bg-slate-100 dark:bg-slate-800 rounded-b-3xl overflow-hidden">
            {localUser?.coverImage ? (
              <img src={localUser.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            )}
          </div>

          <div className="px-4 sm:px-8 pb-8 relative">
            {/* Avatar & Action Buttons */}
            <div className="flex justify-between items-end -mt-16 md:-mt-20 mb-4 relative z-10">
              
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-md">
                {localUser?.profileImage ? (
                  <img src={localUser.profileImage} alt={localUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-black text-5xl">
                    {localUser?.name?.charAt(0).toUpperCase() || "U"}
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
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </button>
              </div>

            </div>

            {/* User Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {localUser?.name || "Explorer"}
                {localUser?.isVerified && <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0" />}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Earth</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Joined {joinedDate}</span>
              </div>

              <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {localUser?.bio || "This traveler hasn't written a bio yet. They are probably too busy exploring the world!"}
              </p>

              {/* Stats */}
              <div className="flex gap-6 mt-6">
                <div className="flex gap-1.5 cursor-pointer hover:underline decoration-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{localUser?.followingCount || 0}</span>
                  <span className="text-slate-500">Following</span>
                </div>
                <div className="flex gap-1.5 cursor-pointer hover:underline decoration-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{localUser?.followersCount || 0}</span>
                  <span className="text-slate-500">Followers</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar px-2 sm:px-8 border-t border-slate-100 dark:border-slate-800/50 w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center flex-col md:flex-row flex-1 md:flex-none gap-1 sm:gap-2 px-1 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
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
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <motion.article 
                    variants={itemVariants} 
                    key={post.id} 
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 shrink-0">
                        {localUser.profileImage ? (
                          <img src={localUser.profileImage} alt={localUser.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold">
                            {localUser.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{localUser.name}</h4>
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
                        <button onClick={() => handleToggleLikes(post.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group text-slate-500 hover:text-rose-600`}>
                          <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" /> 
                          <span className="text-sm font-medium">{post._count?.likes || 0}</span>
                        </button>
                        <button onClick={() => handleToggleComments(post.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group ${expandedComments[post.id] ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                          <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" fill={expandedComments[post.id] ? "currentColor" : "none"} /> 
                          <span className="text-sm font-medium">{post._count?.comments || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Comments Section */}
                    {expandedComments[post.id] && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {loadingComments[post.id] ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
                          </div>
                        ) : commentsData[post.id]?.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">No comments yet. Start the conversation!</p>
                        ) : (
                          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {(commentsData[post.id]?.filter(c => !c.parentId) || []).map((rootComment: any) => (
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
                                     <div className="flex items-center gap-3 mt-1.5 pt-0.5">
                                        <button 
                                          onClick={() => setReplyTargets(prev => ({ ...prev, [post.id]: { id: rootComment.id, name: rootComment.user?.name || 'User' } }))}
                                          className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                        >
                                          Reply
                                        </button>
                                     </div>
                                   </div>
                                 </div>
                                 
                                 {/* Child Replies */}
                                 {(commentsData[post.id]?.filter(child => child.parentId === rootComment.id) || []).map((reply: any) => (
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
                                       <div className="flex items-center gap-3 mt-1.5 pt-0.5">
                                          <button 
                                            onClick={() => setReplyTargets(prev => ({ ...prev, [post.id]: { id: rootComment.id, name: reply.user?.name || 'User' } }))}
                                            className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
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
                        <div className="flex flex-col gap-2 mt-2">
                          {replyTargets[post.id] && (
                             <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800">
                               <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                 Replying to @{replyTargets[post.id]?.name}
                               </span>
                               <button onClick={() => setReplyTargets(prev => ({ ...prev, [post.id]: null }))} className="text-indigo-400 hover:text-indigo-700 cursor-pointer text-xs font-bold">
                                 Cancel
                               </button>
                             </div>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={replyTargets[post.id] ? `Write a reply...` : `Write a comment...`}
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
                              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none px-4 py-2.5 rounded-full text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                              disabled={isSubmittingComment[post.id]}
                            />
                            <button 
                              onClick={() => handlePostComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim() || isSubmittingComment[post.id]}
                              className="p-2.5 rounded-full bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
                            >
                              {isSubmittingComment[post.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 -ml-0.5" />}
                            </button>
                          </div>
                        </div>
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

          {activeTab === "discover" && (
            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <Compass className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Discover</h3>
                <p className="text-slate-500">Find new places and agencies to explore.</p>
              </motion.div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <Bookmark className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No saved items</h3>
                <p className="text-slate-500">Save your favorite posts and packages here.</p>
              </motion.div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <Settings className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Settings</h3>
                <p className="text-slate-500">Manage your account preferences here.</p>
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

      {/* Likes Modal */}
      <AnimatePresence>
        {modalLikesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm" onClick={() => setModalLikesOpen(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden mb-16 shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col border border-slate-100 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" fill="currentColor" /> Reactions
                </h3>
                <button 
                  onClick={() => setModalLikesOpen(null)}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-2 sm:p-4 custom-scrollbar">
                {(() => {
                  const post = posts.find((p: any) => p.id === modalLikesOpen);
                  if (!post || !post.likes || post.likes.length === 0) {
                    return (
                      <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                         <Heart className="h-10 w-10 opacity-20" />
                         <p className="text-sm font-medium">No likes yet.</p>
                      </div>
                    );
                  }
                  return (
                    <div className="flex flex-col gap-1">
                      {post.likes.map((like: any) => (
                        <div key={like.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                            {like.user?.profileImage ? (
                              <img src={like.user.profileImage} alt={like.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-base font-bold text-slate-500 dark:text-slate-400">{like.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{like.user?.name || "Traveler"}</span>
                            <span className="text-xs text-slate-500 truncate">Liked {formatTime(like.createdAt || post.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}