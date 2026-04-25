"use server"

import { cookies } from "next/headers"
import { env } from "@/lib/env"
import { revalidatePath, revalidateTag } from "next/cache"

export const getAdminStats = async () => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/admin/stats`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 0 },
    })
    const result = await res.json()
    return result.success ? result.data : null
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return null
  }
}

export const getPendingAgencies = async () => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(
      `${env.API_URL}/users?role=agency&isVerified=false`,
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { tags: ["pending-agencies"], revalidate: 0 },
      }
    )
    const result = await res.json()
    return result.success ? { data: result.data, meta: result.meta } : { data: [], meta: null }
  } catch (error) {
    console.error("Error fetching pending agencies:", error)
    return { data: [], meta: null }
  }
}

export const approveAgency = async (agencyId: string) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/users/${agencyId}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const result = await res.json()
    if (result.success) {
      revalidateTag("pending-agencies", "max")
      revalidatePath("/admin-dashboard", "page")
    }
    return result
  } catch (error: any) {
    console.error("Error approving agency:", error)
    return {
      success: false,
      message: error.message || "Failed to approve agency",
    }
  }
}

export const rejectAgency = async (agencyId: string) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    // According to PRD, we can DELETE a user. Admin can delete an unverified agency.
    const res = await fetch(`${env.API_URL}/users/${agencyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const result = await res.json()
    if (result.success) {
      revalidateTag("pending-agencies", "max")
      revalidatePath("/admin-dashboard", "page")
    }
    return result
  } catch (error: any) {
    console.error("Error rejecting agency:", error)
    return {
      success: false,
      message: error.message || "Failed to reject agency",
    }
  }
}

export const getAllBookingsAdmin = async (query = "") => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/bookings${query}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 0 },
    })
    const result = await res.json()
    return result.success ? { data: result.data, meta: result.meta } : { data: [], meta: null }
  } catch (error) {
    console.error("Error fetching admin bookings:", error)
    return { data: [], meta: null }
  }
}

export const getAllUsersAdmin = async (query = "") => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/users${query}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 0 },
    })
    const result = await res.json()
    return result.success ? { data: result.data, meta: result.meta } : { data: [], meta: null }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { data: [], meta: null }
  }
}

export const banUser = async (userId: string) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/users/${userId}/ban`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const result = await res.json()
    if (result.success) {
      revalidatePath("/admin-dashboard/users", "page")
    }
    return result
  } catch (error: any) {
    console.error("Error banning user:", error)
    return {
      success: false,
      message: error.message || "Failed to ban user",
    }
  }
}

export const getAllPostsAdmin = async (query = "") => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/posts${query}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 0 },
    })
    const result = await res.json()
    return result.success ? { data: result.data, meta: result.meta } : { data: [], meta: null }
  } catch (error) {
    console.error("Error fetching admin posts:", error)
    return { data: [], meta: null }
  }
}

export const deletePostAdmin = async (postId: string) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    const result = await res.json()
    if (result.success) {
      revalidatePath("/admin-dashboard/posts")
    }
    return result
  } catch (error) {
    console.error("Error deleting post:", error)
    return { success: false, message: "Failed to delete post" }
  }
}

export const getAllReviewsAdmin = async (query = "") => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/reviews${query}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 0 },
    })
    const result = await res.json()
    return result.success ? { data: result.data, meta: result.meta } : { data: [], meta: null }
  } catch (error) {
    console.error("Error fetching admin reviews:", error)
    return { data: [], meta: null }
  }
}

export const deleteReviewAdmin = async (reviewId: string) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    const result = await res.json()
    if (result.success) {
      revalidatePath("/admin-dashboard/reviews")
    }
    return result
  } catch (error) {
    console.error("Error deleting review:", error)
    return { success: false, message: "Failed to delete review" }
  }
}
