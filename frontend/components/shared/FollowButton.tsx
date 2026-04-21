"use client";

import { useState, useEffect } from "react";
import { UserRoundPlus, UserCheck, Loader2 } from "lucide-react";
import { followUser, unfollowUser } from "@/services/follow.service";
import { toast } from "sonner";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
  variant?: "pill" | "full" | "standard";
  targetUserName?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ 
  targetUserId, 
  initialIsFollowing = false, 
  variant = "pill", 
  targetUserName = "",
  onFollowChange
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleToggleFollow = async () => {
    if (isLoading) return;

    if (isFollowing) {
      toast(`Unfollow ${targetUserName || "user"}?`, {
        description: "Are you sure you want to stop following this profile?",
        action: {
          label: "Unfollow",
          onClick: async () => {
            setIsLoading(true);
            const toastId = toast.loading(`Unfollowing ${targetUserName || "user"}...`);
            const res = await unfollowUser(targetUserId);
            if (res?.success) {
              setIsFollowing(false);
              onFollowChange?.(false);
              toast.success(`Unfollowed ${targetUserName || "user"} successfully`, { id: toastId });
            } else {
              toast.error(res?.message || "Failed to unfollow", { id: toastId });
            }
            setIsLoading(false);
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {},
        },
      });
    } else {
      setIsLoading(true);
      const toastId = toast.loading(`Following ${targetUserName || "user"}...`);
      const res = await followUser(targetUserId);
      if (res?.success) {
        setIsFollowing(true);
        onFollowChange?.(true);
        toast.success(`Followed ${targetUserName || "user"} successfully`, { id: toastId });
      } else {
        toast.error(res?.message || "Failed to follow", { id: toastId });
      }
      setIsLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleToggleFollow}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
          isFollowing
            ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400"
            : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 dark:shadow-none"
        } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserCheck className="h-4 w-4" />
            Following
          </>
        ) : (
          <>
            <UserRoundPlus className="h-4 w-4" />
            Follow
          </>
        )}
      </button>
    );
  }

  if (variant === "standard") {
    return (
      <button
        onClick={handleToggleFollow}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
          isFollowing
            ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400"
            : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 dark:shadow-none"
        } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserCheck className="h-4 w-4" />
            Following
          </>
        ) : (
          <>
            <UserRoundPlus className="h-4 w-4" />
            Follow
          </>
        )}
      </button>
    );
  }

  // pill variant
  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
        isFollowing
          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 border border-slate-200 dark:border-slate-700 dark:hover:bg-red-500/20 dark:hover:text-red-400 dark:hover:border-red-500/30"
          : "text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white dark:hover:border-indigo-500"
      } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      title={isFollowing ? `Unfollow ${targetUserName}` : `Follow ${targetUserName}`}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-3.5 w-3.5" />
          Following
        </>
      ) : (
        <>
          <UserRoundPlus className="h-3.5 w-3.5" />
          Follow
        </>
      )}
    </button>
  );
}
