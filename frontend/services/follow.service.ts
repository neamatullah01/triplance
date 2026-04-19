"use server";

import { env } from "@/lib/env";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

/**
 * Follow a user by their ID.
 * POST /api/v1/users/:id/follow
 */
export const followUser = async (targetUserId: string) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${env.API_URL}/users/${targetUserId}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (result.success) {
      // Revalidate both users' cached profile data (follower/following counts)
      const decoded: any = token ? jwtDecode(token) : null;
      if (decoded?.userId) revalidateTag(`user-${decoded.userId}`, 'max');
      revalidateTag(`user-${targetUserId}`, 'max');
    }

    return result;
  } catch (error: any) {
    console.error("Error following user:", error);
    return { success: false, message: error.message || "Failed to follow user" };
  }
};

/**
 * Unfollow a user by their ID.
 * DELETE /api/v1/users/:id/follow
 */
export const unfollowUser = async (targetUserId: string) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${env.API_URL}/users/${targetUserId}/follow`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (result.success) {
      // Revalidate both users' cached profile data (follower/following counts)
      const decoded: any = token ? jwtDecode(token) : null;
      if (decoded?.userId) revalidateTag(`user-${decoded.userId}`, 'max');
      revalidateTag(`user-${targetUserId}`, 'max');
    }

    return result;
  } catch (error: any) {
    console.error("Error unfollowing user:", error);
    return { success: false, message: error.message || "Failed to unfollow user" };
  }
};

/**
 * Get a user's followers list.
 * GET /api/v1/users/:id/followers
 */
export const getFollowers = async (userId: string) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${env.API_URL}/users/${userId}/followers`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { tags: [`user-${userId}`] },
    });

    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error: any) {
    console.error("Error fetching followers:", error);
    return [];
  }
};

/**
 * Get a user's following list.
 * GET /api/v1/users/:id/following
 */
export const getFollowing = async (userId: string) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${env.API_URL}/users/${userId}/following`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { tags: [`user-${userId}`] },
    });

    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error: any) {
    console.error("Error fetching following:", error);
    return [];
  }
};
