"use server";

import { env } from "@/lib/env";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

/**
 * Like a post
 * POST /api/v1/posts/:postId/likes
 */
export const likePost = async (postId: string) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${env.API_URL}/posts/${postId}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error liking post:", error);
    return { success: false, message: error.message || "Failed to like post" };
  }
};

/**
 * Unlike a post
 * DELETE /api/v1/posts/:postId/likes
 */
export const unlikePost = async (postId: string) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${env.API_URL}/posts/${postId}/likes`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error unliking post:", error);
    return { success: false, message: error.message || "Failed to unlike post" };
  }
};
