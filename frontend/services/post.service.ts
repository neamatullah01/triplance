"use server"

import { env } from "@/lib/env"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export const createPost = async (postData: any) => {
  try {
    const storeCookie = await cookies()
    const token = storeCookie.get("token")?.value

    const res = await fetch(`${env.API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })

    const result = await res.json()

    if (result.success && postData.authorId) {
      revalidateTag(`user-${postData.authorId}`, "cache")
    }

    return result
  } catch (error: any) {
    console.error("Error creating post in service:", error)
    return { success: false, message: error.message || "Failed to create post" }
  }
}

export const getFeedPost = async (page: number = 1, limit: number = 10) => {
  try {
    const storeCookie = await cookies()
    const token = storeCookie.get("token")?.value

    const res = await fetch(
      `${env.API_URL}/posts/feed?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["feed"] },
        cache: "no-store", // Or adjust caching strategy based on preference
      }
    )

    const result = await res.json()
    return result
  } catch (error: any) {
    console.error("Error fetching feed:", error)
    return { success: false, message: error.message || "Failed to fetch feed" }
  }
}

export const getMyPosts = async () => {
  try {
    const storeCookie = await cookies()
    const token = storeCookie.get("token")?.value

    const res = await fetch(`${env.API_URL}/posts/my`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    })

    const result = await res.json()
    return result.success ? result.data : []
  } catch (error: any) {
    console.error("Error fetching my posts:", error)
    return []
  }
}

export const deletePost = async (postId: string, authorId?: string) => {
  try {
    const storeCookie = await cookies()
    const token = storeCookie.get("token")?.value

    const res = await fetch(`${env.API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await res.json()

    if (result.success) {
      revalidateTag("feed", "max" as any)
      if (authorId) {
        revalidateTag(`user-${authorId}`, "max" as any)
      }
    }

    return result
  } catch (error: any) {
    console.error("Error deleting post:", error)
    return { success: false, message: error.message || "Failed to delete post" }
  }
}
