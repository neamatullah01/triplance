"use server";

import { env } from "@/lib/env";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

const getToken = async () => {
  const storeCookie = await cookies();
  return (
    storeCookie.get("token")?.value ||
    storeCookie.get("better-auth.session_token")?.value ||
    storeCookie.get("__Secure-better-auth.session_token")?.value
  );
};

/**
 * Follow a user by their ID.
 * POST /api/v1/users/:id/follow
 */
export const followUser = async (targetUserId: string) => {
  try {
    const storeCookie = await cookies();
    const token = await getToken();

    const res = await fetch(`${env.API_URL}/users/${targetUserId}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (result.success) {
      // Try to get userId for cache revalidation – only possible with JWT
      const jwtToken = storeCookie.get("token")?.value;
      if (jwtToken) {
        try {
          const decoded: any = jwtDecode(jwtToken);
          if (decoded?.userId) revalidateTag(`user-${decoded.userId}`, "max");
        } catch {}
      }
      revalidateTag(`user-${targetUserId}`, "max");
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
    const token = await getToken();

    const res = await fetch(`${env.API_URL}/users/${targetUserId}/follow`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (result.success) {
      const jwtToken = storeCookie.get("token")?.value;
      if (jwtToken) {
        try {
          const decoded: any = jwtDecode(jwtToken);
          if (decoded?.userId) revalidateTag(`user-${decoded.userId}`, "max");
        } catch {}
      }
      revalidateTag(`user-${targetUserId}`, "max");
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
    const token = await getToken();

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
    const token = await getToken();

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
