"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  MapPin, Globe, Star, Users, CheckCircle2, 
  Map, Grid, MessageSquare, UserPlus, Check, ExternalLink, Send,
  MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, Loader2
} from "lucide-react";

// You may need to adjust these imports based on your actual file paths
import { likePost, unlikePost } from "@/services/like.service";
import { getComments, addComment } from "@/services/comment.service";

// --- Framer Motion Variants ---
const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

export function AgencyProfileClient({ agency, initialIsFollowing }: { agency: any, initialIsFollowing: boolean }) {
  const [activeTab, setActiveTab] = useState("packages");
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(agency._count?.followers || 0);

  // --- POSTS STATE (For Optimistic Updates) ---
  const [localPosts, setLocalPosts] = useState<any[]>(agency.posts || []);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  // --- COMMENTS STATE ---
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentsData, setCommentsData] = useState<Record<string, any[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [replyTargets, setReplyTargets] = useState<Record<string, { id: string, name: string } | null>>({});

  const tabs = [
    { id: "packages", label: "Packages", icon: Map, count: agency.packages?.length || 0 },
    { id: "posts", label: "Posts", icon: Grid, count: localPosts.length || 0 },
    { id: "reviews", label: "Reviews", icon: Star, count: agency.reviewsReceived?.length || 0 },
  ];

  // Initialize liked state if the backend returns it (Optional, depending on your API)
  useEffect(() => {
    setLikedPosts((prev) => {
      const updated = new Set(prev);
      (agency.posts || []).forEach((post: any) => {
        if (post.isLiked || (post.likes && post.likes.length > 0)) {
          updated.add(post.id);
        }
      });
      return updated;
    });
  }, [agency.posts]);

  // --- HANDLERS ---

  const handleFollow = async () => {
    // In real app: await fetch(`/api/v1/users/${agency.id}/follow`, { method: isFollowing ? 'DELETE' : 'POST' })
    setIsFollowing(!isFollowing);
    setFollowerCount((prev: number) => isFollowing ? prev - 1 : prev + 1);
  };

  const handleToggleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (isLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });

    setLocalPosts((prev) => 
      prev.map(post => {
        if (post.id === postId) {
          const count = post._count?.likes || 0;
          return { ...post, _count: { ...post._count, likes: isLiked ? Math.max(0, count - 1) : count + 1 }};
        }
        return post;
      })
    );

    if (isLiked) {
      const res = await unlikePost(postId);
      if (!res?.success) toast.error(res?.message || "Failed to unlike post");
    } else {
      const res = await likePost(postId);
      if (!res?.success) toast.error(res?.message || "Failed to like post");
    }
  };

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
      
      // Update comment count in the post
      setLocalPosts((prev) => prev.map(post => post.id === postId ? { ...post, _count: { ...post._count, comments: (post._count?.comments || 0) + 1 }} : post));

      // Append new comment instantly to the list
      const newComment = res.data || { 
        id: Math.random().toString(), 
        content: text, 
        parentId, 
        createdAt: new Date().toISOString(), 
        user: { name: "You" } 
      };
      setCommentsData(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    } else {
      toast.error(res?.message || "Failed to post comment", { id: toastId });
    }
    
    setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
  };

  // Helper to neatly format the native ISO date
  const formatTime = (dateString: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const displayName = agency.agencyName || agency.name;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* 1. Hero Cover & Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          
          {/* Cover Image */}
          <div className="h-48 md:h-72 w-full relative bg-slate-100 dark:bg-slate-800 rounded-b-3xl overflow-hidden">
            {agency.coverImage ? (
              <img src={agency.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-90" />
            )}
          </div>

          <div className="px-4 sm:px-8 pb-8 relative">
            {/* Avatar & Action Buttons */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end -mt-16 md:-mt-24 mb-4 relative z-10 gap-4">
              
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl border-4 md:border-8 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-md shrink-0">
                {agency.profileImage ? (
                  <img src={agency.profileImage} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-black text-6xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS: Message & Follow */}
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Link 
                  href={`/messages/new?to=${agency.id}`}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95"
                >
                  <Send className="h-4 w-4" /> Message
                </Link>
                
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
                    isFollowing 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700" 
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 border border-transparent"
                  }`}
                >
                  {isFollowing ? (
                    <><Check className="h-4 w-4" /> Following</>
                  ) : (
                    <><UserPlus className="h-4 w-4" /> Follow</>
                  )}
                </button>
              </div>
            </div>

            {/* Agency Info */}
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {displayName}
                {agency.isVerified && <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-50 shrink-0" />}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-3 font-medium">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full">
                  <Star className="h-4 w-4 fill-orange-500" />
                  {agency.rating > 0 ? `${agency.rating} Average Rating` : "No Ratings Yet"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {followerCount} Followers
                </span>
                {agency.website && (
                  <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline">
                    <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                {agency.bio || "This agency hasn't provided a bio yet."}
              </p>
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
                  <span className="truncate flex items-center gap-1">{tab.label} <span className="opacity-60 font-medium">({tab.count})</span></span>
                  {isActive && (
                    <motion.div
                      layoutId="agency-tab-indicator"
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

      {/* 2. Tab Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agency.packages?.length > 0 ? agency.packages.map((pkg: any) => (
                  <Link key={pkg.id} href={`/explore/${pkg.id}`} className="group block">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                      <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                        {pkg.images?.[0] && (
                          <img src={pkg.images[0]} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                          ৳{pkg.price}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">{pkg.title}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2"><MapPin className="h-3.5 w-3.5" /> {pkg.destination}</p>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <EmptyState icon={Map} title="No packages yet" desc="This agency hasn't published any trips." />
                )}
              </div>
            )}

            {/* POSTS TAB (With Like & Comment Functionality) */}
            {activeTab === "posts" && (
              <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                {localPosts.length > 0 ? localPosts.map((post: any) => (
                  <article key={post.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-900 border border-slate-200 dark:border-slate-700 text-white flex items-center justify-center rounded-full font-bold overflow-hidden shadow-sm">
                          {agency.profileImage ? (
                            <img src={agency.profileImage} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{displayName}</h4>
                            {agency.isVerified && <CheckCircle2 className="h-4 w-4 text-blue-500" fill="currentColor" />}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            {formatTime(post.createdAt)} {post.location && <><MapPin className="h-3 w-3 inline ml-1"/> {post.location}</>}
                          </p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Dynamic Image Grid */}
                    {post.images && post.images.length > 0 && (
                      <div className={`grid gap-2 mb-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.images.map((img: string, idx: number) => (
                          <div 
                            key={idx} 
                            className={`h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden ${
                              post.images.length > 1 && idx === 0 ? 'rounded-r-none' : 
                              post.images.length > 1 && idx === 1 ? 'rounded-l-none' : ''
                            }`}
                          >
                            <img src={img} alt="Post Media" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Unified Action Bar */}
                    <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => handleToggleLike(post.id)} 
                          className={`flex items-center gap-2 transition-colors cursor-pointer group ${likedPosts.has(post.id) ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}
                        >
                          <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" fill={likedPosts.has(post.id) ? "currentColor" : "none"} /> 
                          <span className="text-sm font-medium">{post._count?.likes || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleToggleComments(post.id)} 
                          className={`flex items-center gap-2 transition-colors cursor-pointer group ${expandedComments[post.id] ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                        >
                          <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" fill={expandedComments[post.id] ? "currentColor" : "none"} /> 
                          <span className="text-sm font-medium">{post._count?.comments || 0}</span>
                        </button>
                        <button className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                      <button className="text-slate-500 hover:text-indigo-900 transition-colors cursor-pointer">
                        <Bookmark className="h-5 w-5" />
                      </button>
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
                  </article>
                )) : (
                  <EmptyState icon={Grid} title="No posts yet" desc="This agency hasn't shared any updates." />
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="flex flex-col gap-4 max-w-3xl">
                {agency.reviewsReceived?.length > 0 ? agency.reviewsReceived.map((review: any) => (
                  <div key={review.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shrink-0">
                      {review.traveler?.name?.charAt(0) || "T"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{review.traveler?.name || "Traveler"}</h4>
                        <div className="flex gap-0.5 ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-slate-200 dark:text-slate-700'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{review.comment}</p>
                    </div>
                  </div>
                )) : (
                  <EmptyState icon={MessageSquare} title="No reviews yet" desc="Travelers haven't reviewed this agency yet." />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

// Reusable Empty State Component
function EmptyState({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
      <Icon className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-slate-500 mt-1">{desc}</p>
    </div>
  );
}