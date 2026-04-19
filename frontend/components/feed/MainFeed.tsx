"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, CheckCircle2, Loader2, MapPin, ArrowUp, Send } from "lucide-react";
import { getFeedPost } from "@/services/post.service";
import { getUser } from "@/services/auth.service";
import { getFollowing } from "@/services/follow.service";
import { likePost, unlikePost } from "@/services/like.service";
import { getComments, addComment } from "@/services/comment.service";
import { FollowButton } from "@/components/shared/FollowButton";
import Link from "next/link";
import { toast } from "sonner";

export function MainFeed() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentsData, setCommentsData] = useState<Record<string, any[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [replyTargets, setReplyTargets] = useState<Record<string, { id: string, name: string } | null>>({});
  
  const observerTarget = useRef(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const result = await getFeedPost(page, 10);
      
      if (result && result.success && result.data) {
        // Backend pattern might wrap array in result.data or result.data.data
        const fetchedItems = Array.isArray(result.data?.data) 
             ? result.data.data 
             : Array.isArray(result.data) 
                 ? result.data 
                 : [];

        if (fetchedItems.length > 0) {
          setFeedItems(prev => {
            // Filter out exact duplicates based on ID
            const newItems = fetchedItems.filter((newItem: any) => !prev.some(item => item.id === newItem.id));
            return [...prev, ...newItems];
          });
          
          // Pre-populate liked state if the backend starts sending it
          setLikedPosts(prevLikes => {
             const updated = new Set(prevLikes);
             fetchedItems.forEach((item: any) => {
                if (item.isLiked || (item.likes && item.likes.length > 0)) {
                   updated.add(item.id);
                }
             });
             return updated;
          });
          
          setPage(prev => prev + 1);
        } else {
          setHasMore(false);
        }

        if (fetchedItems.length < 10) {
          setHasMore(false);
        }
      } else {
         setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load feed", error);
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
    }
  }, [page, isLoading, hasMore]);

  const refreshFeed = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setFeedItems([]); // Clear feed visually for a clean refresh state
    
    try {
      const result = await getFeedPost(1, 10);
      
      if (result && result.success && result.data) {
        const fetchedItems = Array.isArray(result.data?.data) 
             ? result.data.data 
             : Array.isArray(result.data) 
                 ? result.data 
                 : [];

        setFeedItems(fetchedItems);
        
        // Auto-detect liked status on refresh
        setLikedPosts(prevLikes => {
           const updated = new Set(prevLikes);
           fetchedItems.forEach((item: any) => {
              if (item.isLiked || (item.likes && item.likes.length > 0)) {
                 updated.add(item.id);
              }
           });
           return updated;
        });

        setPage(2);
        setHasMore(fetchedItems.length >= 10);
      } else {
         setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to refresh feed", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Handle Intersection Observer for Infinite Scroll Pagination
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Trigger loadMore when the sentry div intersects the viewport
        if (entries[0].isIntersecting && !isLoading && !initialLoad) {
          if (hasMore) {
             loadMore();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, hasMore, isLoading, initialLoad]);

  // Initial Data Fetch
  useEffect(() => {
    if (page === 1 && feedItems.length === 0) {
       loadMore();
    }
  }, []); 

  // Load Initial Following List
  useEffect(() => {
    async function loadFollowingList() {
      try {
        const user = await getUser();
        if (user?.id) {
          const list = await getFollowing(user.id);
          setFollowing(new Set(list.map((f: any) => f.followingId)));
        }
      } catch (error) {
        // silently ignore error
      }
    }
    loadFollowingList();
  }, []);

  // Global Event Listener for New Posts
  useEffect(() => {
    const handleRemoteRefresh = () => {
      const scrollContainer = document.querySelector('main.overflow-y-auto') || window;
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      refreshFeed();
    };

    window.addEventListener("refreshMainFeed", handleRemoteRefresh);
    return () => window.removeEventListener("refreshMainFeed", handleRemoteRefresh);
  }, [refreshFeed]); 

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

  const handleToggleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (isLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });

    setFeedItems((prev) => 
      prev.map(item => {
        if (item.id === postId) {
          const count = item._count?.likes || 0;
          return { ...item, _count: { ...item._count, likes: isLiked ? Math.max(0, count - 1) : count + 1 }};
        }
        return item;
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
      
      setFeedItems((prev) => prev.map(item => item.id === postId ? { ...item, _count: { ...item._count, comments: (item._count?.comments || 0) + 1 }} : item));

      const newComment = res.data || { id: Math.random().toString(), content: text, parentId, createdAt: new Date().toISOString(), user: { name: "You" } };
      setCommentsData(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    } else {
      toast.error(res?.message || "Failed to post comment", { id: toastId });
    }
    
    setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filter Chips */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-center gap-3 pb-4 pt-2 px-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl -mx-1">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent("refreshMainFeed"))}
          className="px-5 py-2 bg-indigo-700 text-white text-sm font-medium rounded-full whitespace-nowrap cursor-pointer hover:bg-indigo-800 transition-colors"
        >
          All Posts
        </button>
        <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer">
          Top Experiences
        </button>
        <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer">
          Local Guides
        </button>
        <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer">
          Photography
        </button>
      </div>

      {/* Dynamic Infinite Feed Timeline */}
      {feedItems.map((item) => (
        <article key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          
          {item.feedType === 'PACKAGE' ? (
            /* --- PACKAGE TIMELINE CARD --- */
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-900 border border-slate-200 dark:border-slate-700 text-white flex items-center justify-center rounded-full font-bold overflow-hidden shadow-sm">
                    {item.author?.profileImage ? (
                      <img src={item.author.profileImage} alt={item.author.name} className="w-full h-full object-cover" />
                    ) : (
                      item.author?.name ? item.author.name.substring(0, 1).toUpperCase() : 'A'
                     )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.author?.name || 'Agency'}</h4>
                      <CheckCircle2 className="h-4 w-4 text-blue-500" fill="currentColor" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Agency Spotlight • Sponsored</p>
                  </div>
                </div>
                {item.author?.id && following.has(item.author.id) ? (
                  <Link href={`/agencies/${item.author.id}`}>
                    <button className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
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
                        setFollowing(prev => new Set(prev).add(item.author.id));
                      }
                    }}
                  />
                )}
              </div>

              {/* Dynamic Gridded Image Output based on array length */}
              {item.images && item.images.length > 0 && (
                <div className={`grid gap-2 mb-4 ${item.images.length >= 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {item.images.length >= 3 ? (
                    <>
                      <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                         <img src={item.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Package Media" />
                      </div>
                      <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                        <img src={item.images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Package Media" />
                      </div>
                      <div className="col-span-2 h-48 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                        <img src={item.images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Package Media" />
                      </div>
                    </>
                  ) : (
                    <div className="col-span-1 h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                       <img src={item.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Package Media" />
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 truncate">
                {item.content?.split('\n\n')[0] || 'Exclusive Tour Package'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 line-clamp-3">
                {item.content?.split('\n\n')[1] || item.content}
              </p>

              <button className="w-full py-3 bg-rose-800 hover:bg-rose-900 text-white font-medium rounded-xl transition-colors text-sm shadow-sm cursor-pointer">
                View Expedition Details
              </button>
            </>
          ) : (
            /* --- TRAVELER POST TIMELINE CARD --- */
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                    {item.author?.profileImage ? (
                      <img src={item.author.profileImage} alt={item.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                        {item.author?.name ? item.author.name.substring(0, 1).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.author?.name || 'Traveler'}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {formatTime(item.createdAt)} {item.location && <><MapPin className="h-3 w-3 inline ml-1"/> {item.location}</>}
                    </p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                {item.content}
              </p>

              {item.images && item.images.length > 0 && (
                <div className={`grid gap-2 ${item.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                   {item.images.map((img: string, idx: number) => (
                      <div key={idx} className={`h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden ${item.images.length > 1 && idx === 0 ? 'rounded-r-none' : item.images.length > 1 && idx === 1 ? 'rounded-l-none' : ''}`}>
                         <img src={img} alt="Post Media" className="w-full h-full object-cover" />
                      </div>
                   ))}
                </div>
              )}
            </>
          )}

          {/* Unified Action Bar (Applies to both PACKAGE and POST) */}
          <div className={`flex items-center justify-between pt-3 mt-4 ${item.feedType === 'PACKAGE' ? 'border-t border-slate-100 dark:border-slate-800/50' : ''}`}>
            <div className="flex items-center gap-6">
              <button onClick={() => handleToggleLike(item.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group ${likedPosts.has(item.id) ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>
                <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" fill={likedPosts.has(item.id) ? "currentColor" : "none"} /> 
                <span className="text-sm font-medium">{item._count?.likes || 0}</span>
              </button>
              <button onClick={() => handleToggleComments(item.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group ${expandedComments[item.id] ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" fill={expandedComments[item.id] ? "currentColor" : "none"} /> 
                <span className="text-sm font-medium">{item._count?.comments || 0}</span>
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
          {expandedComments[item.id] && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {loadingComments[item.id] ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
                </div>
              ) : commentsData[item.id]?.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">No comments yet. Start the conversation!</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {(commentsData[item.id]?.filter(c => !c.parentId) || []).map((rootComment: any) => (
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
                                onClick={() => setReplyTargets(prev => ({ ...prev, [item.id]: { id: rootComment.id, name: rootComment.user?.name || 'User' } }))}
                                className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                              >
                                Reply
                              </button>
                           </div>
                         </div>
                       </div>
                       
                       {/* Child Replies */}
                       {(commentsData[item.id]?.filter(child => child.parentId === rootComment.id) || []).map((reply: any) => (
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
                                  onClick={() => setReplyTargets(prev => ({ ...prev, [item.id]: { id: rootComment.id, name: reply.user?.name || 'User' } }))}
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
                {replyTargets[item.id] && (
                   <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800">
                     <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                       Replying to @{replyTargets[item.id]?.name}
                     </span>
                     <button onClick={() => setReplyTargets(prev => ({ ...prev, [item.id]: null }))} className="text-indigo-400 hover:text-indigo-700 cursor-pointer text-xs font-bold">
                       Cancel
                     </button>
                   </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={replyTargets[item.id] ? `Write a reply...` : `Write a comment...`}
                    value={commentInputs[item.id] || ""}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment(item.id)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none px-4 py-2.5 rounded-full text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    disabled={isSubmittingComment[item.id]}
                  />
                  <button 
                    onClick={() => handlePostComment(item.id)}
                    disabled={!commentInputs[item.id]?.trim() || isSubmittingComment[item.id]}
                    className="p-2.5 rounded-full bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
                  >
                    {isSubmittingComment[item.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 -ml-0.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </article>
      ))}

      {/* Infinite Scroll Sentry Marker */}
      <div ref={observerTarget} className="py-6 flex flex-col justify-center items-center min-h-[120px]">
        {isLoading ? (
           <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
        ) : !hasMore && feedItems.length > 0 ? (
           <div className="flex flex-col items-center gap-4 pb-10 mt-4">
             <button 
               onClick={() => {
                 const scrollContainer = document.querySelector('main.overflow-y-auto') || window;
                 scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
                 refreshFeed();
               }}
               title="Back to top"
               className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors cursor-pointer shadow-sm animate-bounce hover:animate-none"
             >
               <ArrowUp className="h-5 w-5" />
             </button>
           </div>
        ) : !hasMore && feedItems.length === 0 ? (
           <p className="text-sm text-slate-500 font-medium pb-10">No feed posts available.</p>
        ) : null}
      </div>

    </div>
  );
}