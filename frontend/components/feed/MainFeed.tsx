"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { 
  MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, 
  CheckCircle2, Loader2, MapPin, ArrowUp, Send, 
  ChevronLeft, ChevronRight, X // Added icons for the Lightbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Added for smooth Lightbox animations
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
  
  // --- NEW STATE: Lightbox Image Viewer ---
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; images: string[]; currentIndex: number }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  const observerTarget = useRef(null);

  // ... [Keep your existing loadMore, refreshFeed, useEffects, formatTime, handleToggleLike, handleToggleComments, handlePostComment functions EXACTLY as they are] ...
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const result = await getFeedPost(page, 10);
      if (result && result.success && result.data) {
        const fetchedItems = Array.isArray(result.data?.data) ? result.data.data : Array.isArray(result.data) ? result.data : [];
        if (fetchedItems.length > 0) {
          setFeedItems(prev => {
            const newItems = fetchedItems.filter((newItem: any) => !prev.some(item => item.id === newItem.id));
            return [...prev, ...newItems];
          });
          setLikedPosts(prevLikes => {
             const updated = new Set(prevLikes);
             fetchedItems.forEach((item: any) => {
                if (item.isLiked || (item.likes && item.likes.length > 0)) updated.add(item.id);
             });
             return updated;
          });
          setPage(prev => prev + 1);
        } else {
          setHasMore(false);
        }
        if (fetchedItems.length < 10) setHasMore(false);
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
    setFeedItems([]); 
    try {
      const result = await getFeedPost(1, 10);
      if (result && result.success && result.data) {
        const fetchedItems = Array.isArray(result.data?.data) ? result.data.data : Array.isArray(result.data) ? result.data : [];
        setFeedItems(fetchedItems);
        setLikedPosts(prevLikes => {
           const updated = new Set(prevLikes);
           fetchedItems.forEach((item: any) => {
              if (item.isLiked || (item.likes && item.likes.length > 0)) updated.add(item.id);
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

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading && !initialLoad && hasMore) loadMore();
      }, { threshold: 0.1 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [loadMore, hasMore, isLoading, initialLoad]);

  useEffect(() => { if (page === 1 && feedItems.length === 0) loadMore(); }, []); 

  useEffect(() => {
    async function loadFollowingList() {
      try {
        const user = await getUser();
        if (user?.id) {
          const list = await getFollowing(user.id);
          setFollowing(new Set(list.map((f: any) => f.followingId)));
        }
      } catch (error) {}
    }
    loadFollowingList();
  }, []);

  useEffect(() => {
    const handleRemoteRefresh = () => {
      const scrollContainer = document.querySelector('main.overflow-y-auto') || window;
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      refreshFeed();
    };
    window.addEventListener("refreshMainFeed", handleRemoteRefresh);
    return () => window.removeEventListener("refreshMainFeed", handleRemoteRefresh);
  }, [refreshFeed]); 

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
      if (isLiked) next.delete(postId); else next.add(postId);
      return next;
    });
    setFeedItems((prev) => prev.map(item => {
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
      } catch (err) { toast.error("Failed to load comments"); } 
      finally { setLoadingComments(prev => ({ ...prev, [postId]: false })); }
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

  // --- NEW: Smart Image Grid Generator ---
  const renderImageGrid = (images: string[]) => {
    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => {
      setLightbox({ isOpen: true, images, currentIndex: index });
    };

    // 1 Image (Full size)
    if (images.length === 1) {
      return (
        <div onClick={() => openLightbox(0)} className="mb-4 w-full h-64 sm:h-96 rounded-2xl overflow-hidden cursor-pointer">
          <img src={images[0]} alt="Post Media" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      );
    }

    // 2 Images (Side by Side)
    if (images.length === 2) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden">
          <div onClick={() => openLightbox(0)} className="w-full aspect-[4/5] cursor-pointer"><img src={images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
          <div onClick={() => openLightbox(1)} className="w-full aspect-[4/5] cursor-pointer"><img src={images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
        </div>
      );
    }

    // 3 Images (1 Top, 2 Bottom)
    if (images.length === 3) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden">
          <div onClick={() => openLightbox(0)} className="col-span-2 w-full aspect-[2/1] cursor-pointer"><img src={images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
          <div onClick={() => openLightbox(1)} className="w-full aspect-square cursor-pointer"><img src={images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
          <div onClick={() => openLightbox(2)} className="w-full aspect-square cursor-pointer"><img src={images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
        </div>
      );
    }

    // 4 or more Images (2x2 Grid with +X overlay)
    return (
      <div className="mb-4 grid grid-cols-2 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden">
        <div onClick={() => openLightbox(0)} className="w-full aspect-square cursor-pointer"><img src={images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
        <div onClick={() => openLightbox(1)} className="w-full aspect-square cursor-pointer"><img src={images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
        <div onClick={() => openLightbox(2)} className="w-full aspect-square cursor-pointer"><img src={images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>
        
        {/* 4th Image Container (With optional +X More overlay) */}
        <div onClick={() => openLightbox(3)} className="relative w-full aspect-square cursor-pointer group overflow-hidden">
          <img src={images[3]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {images.length > 4 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center text-white text-3xl font-bold transition-all group-hover:bg-black/40">
              +{images.length - 4}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Filter Chips */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-center gap-3 pb-4 pt-2 px-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl -mx-1">
         {/* ... Filters stay exactly the same ... */}
         <button onClick={() => window.dispatchEvent(new CustomEvent("refreshMainFeed"))} className="px-5 py-2 bg-indigo-700 text-white text-sm font-medium rounded-full whitespace-nowrap cursor-pointer hover:bg-indigo-800 transition-colors">All Posts</button>
         <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer">Top Experiences</button>
         <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer">Local Guides</button>
         <button className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer">Photography</button>
      </div>

      {/* Dynamic Infinite Feed Timeline */}
      {feedItems.map((item) => (
        <article key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          
          {item.feedType === 'PACKAGE' ? (
            <>
              {/* Package Header */}
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-indigo-900 border border-slate-200 dark:border-slate-700 text-white flex items-center justify-center rounded-full font-bold overflow-hidden shadow-sm">
                     {item.author?.profileImage ? <img src={item.author.profileImage} alt={item.author.name} className="w-full h-full object-cover" /> : item.author?.name ? item.author.name.substring(0, 1).toUpperCase() : 'A'}
                   </div>
                   <div>
                     <div className="flex items-center gap-1"><h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.author?.name || 'Agency'}</h4><CheckCircle2 className="h-4 w-4 text-blue-500" fill="currentColor" /></div>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Agency Spotlight • Sponsored</p>
                   </div>
                 </div>
                 {/* Follow logic remains unchanged */}
              </div>

              {/* ✅ NEW: Smart Image Grid replacing old manual rendering */}
              {renderImageGrid(item.images)}

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 truncate">{item.content?.split('\n\n')[0] || 'Exclusive Tour Package'}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 line-clamp-3">{item.content?.split('\n\n')[1] || item.content}</p>
              <button className="w-full py-3 bg-rose-800 hover:bg-rose-900 text-white font-medium rounded-xl transition-colors text-sm shadow-sm cursor-pointer">View Expedition Details</button>
            </>
          ) : (
            <>
              {/* Traveler Post Header */}
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                     {item.author?.profileImage ? <img src={item.author.profileImage} alt={item.author.name} className="w-full h-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold">{item.author?.name ? item.author.name.substring(0, 1).toUpperCase() : 'U'}</div>}
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.author?.name || 'Traveler'}</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">{formatTime(item.createdAt)} {item.location && <><MapPin className="h-3 w-3 inline ml-1"/> {item.location}</>}</p>
                   </div>
                 </div>
                 <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{item.content}</p>

              {/* ✅ NEW: Smart Image Grid replacing old 6-line map rendering */}
              {renderImageGrid(item.images)}
            </>
          )}

          {/* Action Bar & Comments section stay EXACTLY as they are... */}
          <div className={`flex items-center justify-between pt-3 mt-4 ${item.feedType === 'PACKAGE' ? 'border-t border-slate-100 dark:border-slate-800/50' : ''}`}>
             {/* ... */}
             <div className="flex items-center gap-6">
                <button onClick={() => handleToggleLike(item.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group ${likedPosts.has(item.id) ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}><Heart className="h-5 w-5 group-hover:scale-110 transition-transform" fill={likedPosts.has(item.id) ? "currentColor" : "none"} /> <span className="text-sm font-medium">{item._count?.likes || 0}</span></button>
                <button onClick={() => handleToggleComments(item.id)} className={`flex items-center gap-2 transition-colors cursor-pointer group ${expandedComments[item.id] ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}><MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" fill={expandedComments[item.id] ? "currentColor" : "none"} /> <span className="text-sm font-medium">{item._count?.comments || 0}</span></button>
                <button className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"><Share2 className="h-5 w-5" /></button>
             </div>
             <button className="text-slate-500 hover:text-indigo-900 transition-colors cursor-pointer"><Bookmark className="h-5 w-5" /></button>
          </div>

          {/* ... Comments Mapping logic remains untouched ... */}
        </article>
      ))}

      {/* Infinite Scroll Sentry */}
      <div ref={observerTarget} className="py-6 flex flex-col justify-center items-center min-h-[120px]">
        {/* ... Load More Logic unchanged ... */}
      </div>

      {/* --- NEW: Fullscreen Lightbox Viewer Modal --- */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
          >
            {/* Top Bar controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
              <span className="text-white/80 text-sm font-medium tracking-wide">
                {lightbox.currentIndex + 1} / {lightbox.images.length}
              </span>
              <button 
                onClick={() => setLightbox({ ...lightbox, isOpen: false })}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Previous Button */}
            {lightbox.images.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, currentIndex: (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length });
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            {/* Main Image */}
            <motion.img 
              key={lightbox.currentIndex} // forces re-animation on index change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightbox.images[lightbox.currentIndex]} 
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" 
            />

            {/* Next Button */}
            {lightbox.images.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length });
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}