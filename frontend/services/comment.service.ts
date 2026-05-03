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
 * Get all comments for a post
 * GET /api/v1/posts/:postId/comments
 */
export const getComments = async (postId: string) => {
  try {
    const res = await fetch(`${env.API_URL}/posts/${postId}/comments`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

/**
 * Add a comment to a post
 * POST /api/v1/posts/:postId/comments
 */
export const addComment = async (postId: string, text: string, parentId?: string) => {
  try {
    const token = await getToken();

    const bodyPayload: any = { text };
    if (parentId) {
      bodyPayload.parentId = parentId;
    }

    const res = await fetch(`${env.API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyPayload),
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error adding comment:", error);
    return { success: false, message: error.message || "Failed to add comment" };
  }
};
