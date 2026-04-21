"use client";

import { useState } from "react";
import { 
  MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, 
  CheckCircle2, Loader2, MapPin, Send, ChevronLeft, ChevronRight, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { likePost, unlikePost } from "@/services/like.service";
import { getComments, addComment } from "@/services/comment.service";
import { FollowButton } from "@/components/shared/FollowButton";

interface PostCardProps {
  post: any;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  // ✅ Added callback to sync with parent if needed
  onUpdate?: (postId: string, updatedData: any) => void;
}

export function PostCard({ post, initialIsFollowing = false, onFollowChange, onUpdate }: PostCardProps) {
  // --- States ---
  const [isLiked, setIsLiked] = useState(post.isLiked || (post.likes && post.likes.length > 0));
  const [likeCount, setLikeCount] = useState<number>(post._count?.likes || 0);
  const [commentCount, setCommentCount] = useState<number>(post._count?.comments || 0);
  
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{ id: string, name: string } | null>(null);

  const [lightbox, setLightbox] = useState<{ isOpen: boolean; currentIndex: number }>({
    isOpen: false,
    currentIndex: 0,
  });

  // --- Handlers ---

  const handleToggleLike = async () => {
    // 1. Optimistic Update
    const previousState = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!previousState);
    setLikeCount(prev => !previousState ? prev + 1 : Math.max(0, prev - 1));

    try {
      const res = !previousState ? await likePost(post.id) : await unlikePost(post.id);
      
      if (!res?.success) {
        throw new Error(res?.message || "Action failed");
      }
      
      // Sync with parent state if provided
      if (onUpdate) onUpdate(post.id, { isLiked: !previousState, likeCount: !previousState ? previousCount + 1 : previousCount - 1 });

    } catch (error: any) {
      // 2. Rollback on failure
      setIsLiked(previousState);
      setLikeCount(previousCount);
      toast.error(error.message || "Failed to update like");
    }
  };

  const handleToggleComments = async () => {
    const willExpand = !isCommentsExpanded;
    setIsCommentsExpanded(willExpand);

    // Fetch comments only if expanding and not already loaded
    if (willExpand && commentsData.length === 0) {
      setIsLoadingComments(true);
      try {
        const comments = await getComments(post.id);
        // Ensure we handle both data.data and data formats
        const formattedComments = Array.isArray(comments) ? comments : (comments?.data || []);
        setCommentsData(formattedComments);
      } catch (err) {
        toast.error("Failed to load comments");
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const handlePostComment = async () => {
    const text = commentInput.trim();
    if (!text) return;

    setIsSubmittingComment(true);
    const toastId = toast.loading(replyTarget ? "Replying..." : "Commenting...");

    try {
      const res = await addComment(post.id, text, replyTarget?.id);
      
      if (res?.success) {
        toast.success("Added successfully", { id: toastId });
        
        // Update counts
        const newCount = commentCount + 1;
        setCommentCount(newCount);
        
        // Add to local list (Backend should return the new comment object)
        const newComment = res.data || { 
          id: Date.now().toString(), 
          content: text, 
          createdAt: new Date().toISOString(), 
          user: { name: "You", profileImage: null },
          parentId: replyTarget?.id || null
        };

        setCommentsData(prev => [newComment, ...prev]);
        setCommentInput("");
        setReplyTarget(null);

        if (onUpdate) onUpdate(post.id, { commentCount: newCount });
      } else {
        throw new Error(res?.message || "Failed to post comment");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // --- Helpers ---

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const renderImageGrid = (images: string[]) => {
    if (!images || images.length === 0) return null;
    const openLightbox = (index: number) => setLightbox({ isOpen: true, currentIndex: index });

    if (images.length === 1) return (
      <div onClick={() => openLightbox(0)} className="mb-4 w-full h-64 sm:h-96 rounded-2xl overflow-hidden cursor-pointer group">
        <img src={images[0]} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    );

    const gridClass = images.length === 2 ? "grid-cols-2" : "grid-cols-2";
    return (
      <div className={`mb-4 grid ${gridClass} gap-2 rounded-2xl overflow-hidden`}>
        {images.slice(0, 4).map((img, i) => (
          <div 
            key={i} 
            onClick={() => openLightbox(i)} 
            className={`relative aspect-square cursor-pointer overflow-hidden group ${images.length === 3 && i === 0 ? 'col-span-2 aspect-[2/1]' : ''}`}
          >
            <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            {i === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                +{images.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <article className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 flex items-center justify-center rounded-full font-bold overflow-hidden border ${post.feedType === 'PACKAGE' ? 'bg-indigo-900 border-indigo-200 text-white' : 'bg-slate-100 dark:bg-slate-800 border-slate-200'}`}>
            {post.author?.profileImage ? <img src={post.author.profileImage} className="w-full h-full object-cover" /> : <span>{post.author?.name?.charAt(0) || 'U'}</span>}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{post.author?.name || 'User'}</h4>
              {post.feedType === 'PACKAGE' && <CheckCircle2 className="h-4 w-4 text-blue-500" fill="currentColor"/>}
            </div>
            <p className="text-xs text-slate-500">{post.feedType === 'PACKAGE' ? 'Agency Spotlight • Sponsored' : formatTime(post.createdAt)}</p>
          </div>
        </div>
        {post.feedType === 'PACKAGE' ? (
          <FollowButton targetUserId={post.author?.id} initialIsFollowing={initialIsFollowing} variant="pill" onFollowChange={onFollowChange}/>
        ) : <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal className="h-5 w-5"/></button>}
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed mb-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>
      {renderImageGrid(post.images)}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-6">
          <button onClick={handleToggleLike} className={`flex items-center gap-2 transition-all active:scale-90 ${isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>
            <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"}/> 
            <span className="text-sm font-semibold">{likeCount}</span>
          </button>
          <button onClick={handleToggleComments} className={`flex items-center gap-2 transition-all ${isCommentsExpanded ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
            <MessageCircle className="h-5 w-5" fill={isCommentsExpanded ? "currentColor" : "none"}/> 
            <span className="text-sm font-semibold">{commentCount}</span>
          </button>
          <button className="text-slate-500 hover:text-blue-600 transition-colors"><Share2 className="h-5 w-5"/></button>
        </div>
        <button className="text-slate-500 hover:text-amber-600 transition-colors"><Bookmark className="h-5 w-5"/></button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {isCommentsExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {isLoadingComments ? (
                <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-indigo-500"/></div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {commentsData.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4 italic">Be the first to share a thought...</p>
                  ) : (
                    commentsData.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3 group">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden">
                          <img src={comment.user?.profileImage || "/default-avatar.png"} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl relative">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{comment.user?.name}</span>
                            <span className="text-[10px] text-slate-400">{formatTime(comment.createdAt)}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{comment.content}</p>
                          <button 
                            onClick={() => {
                                setReplyTarget({ id: comment.id, name: comment.user?.name });
                                document.getElementById(`input-${post.id}`)?.focus();
                            }}
                            className="text-[10px] font-bold text-indigo-500 mt-2 hover:underline"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Input Area */}
              <div className="mt-4 space-y-2">
                {replyTarget && (
                  <div className="flex items-center justify-between px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <span className="text-[10px] text-indigo-600">Replying to <b>@{replyTarget.name}</b></span>
                    <button onClick={() => setReplyTarget(null)}><X className="h-3 w-3 text-indigo-600"/></button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input 
                    id={`input-${post.id}`}
                    type="text" 
                    value={commentInput} 
                    onChange={e => setCommentInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handlePostComment()}
                    placeholder="Add a comment..." 
                    className="flex-1 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  />
                  <button 
                    onClick={handlePostComment} 
                    disabled={!commentInput.trim() || isSubmittingComment} 
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <button onClick={() => setLightbox({ ...lightbox, isOpen: false })} className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full"><X className="h-8 w-8"/></button>
            {post.images.length > 1 && (
              <>
                <button onClick={() => setLightbox(p => ({...p, currentIndex: (p.currentIndex - 1 + post.images.length) % post.images.length}))} className="absolute left-4 text-white p-2 bg-white/10 rounded-full"><ChevronLeft className="h-10 w-10"/></button>
                <button onClick={() => setLightbox(p => ({...p, currentIndex: (p.currentIndex + 1) % post.images.length}))} className="absolute right-4 text-white p-2 bg-white/10 rounded-full"><ChevronRight className="h-10 w-10"/></button>
              </>
            )}
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={post.images[lightbox.currentIndex]} 
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}