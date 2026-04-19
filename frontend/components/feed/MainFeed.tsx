"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, CheckCircle2, Loader2, MapPin, ArrowUp } from "lucide-react";
import { getFeedPost } from "@/services/post.service";
import { getUser } from "@/services/auth.service";
import { getFollowing } from "@/services/follow.service";
import { FollowButton } from "@/components/shared/FollowButton";
import Link from "next/link";

export function MainFeed() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  
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
                <div className={`grid gap-2 mb-4 ${item.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                   {item.images.map((img: string, idx: number) => (
                      <div key={idx} className={`h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden ${item.images.length > 1 && idx === 0 ? 'rounded-r-none' : item.images.length > 1 && idx === 1 ? 'rounded-l-none' : ''}`}>
                         <img src={img} alt="Post Media" className="w-full h-full object-cover" />
                      </div>
                   ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer group">
                    <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" /> <span className="text-sm font-medium">{item._count?.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group">
                    <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" /> <span className="text-sm font-medium">{item._count?.comments || 0}</span>
                  </button>
                  <button className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <button className="text-slate-500 hover:text-indigo-900 transition-colors cursor-pointer">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </>
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