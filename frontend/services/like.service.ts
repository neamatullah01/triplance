"use server";

import { env } from "@/lib/env";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const getToken = async () => {
  const storeCookie = await cookies();
  return (
    storeCookie.get("token")?.value ||
    storeCookie.get("better-auth.session_token")?.value ||
    storeCookie.get("__Secure-better-auth.session_token")?.value
  );
};

/**
 * Like a post
 * POST /api/v1/posts/:postId/likes
 */
export const likePost = async (postId: string) => {
  try {
    const token = await getToken();
    const res = await fetch(`${env.API_URL}/posts/${postId}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log("Like result:", result);
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
    const token = await getToken();

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
