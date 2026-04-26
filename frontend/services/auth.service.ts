"use server"
import { jwtDecode } from "jwt-decode"
import { FieldValues } from "react-hook-form"
import { cookies } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"
import { env } from "@/lib/env"

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${env.AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-cache",
    })

    // If the response is not JSON (e.g. Vercel 500 HTML page), this will throw
    let result
    try {
      result = await res.json()
    } catch (parseError) {
      console.error("Failed to parse login response:", parseError)
      return {
        success: false,
        message: `Server error: Could not parse response from ${env.AUTH_URL}/login`,
      }
    }

    const { accessToken, refreshToken } = result?.data || {}
    const storeCookie = await cookies()

    if (result.success) {
      storeCookie.set({
        name: "token",
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      if (refreshToken) {
        storeCookie.set({
          name: "refreshToken",
          value: refreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 60 * 60 * 24 * 30,
        })
      }
    }
    return result
  } catch (error: any) {
    console.error("Login fetch error:", error)
    return {
      success: false,
      message: error.message || "Network error during login",
    }
  }
}

export const createUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${env.AUTH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-cache",
    })

    let result
    try {
      result = await res.json()
    } catch (parseError) {
      console.error("Failed to parse registration response:", parseError)
      return {
        success: false,
        message: `Server error: Could not parse response from ${env.AUTH_URL}/register`,
      }
    }

    const { accessToken, refreshToken } = result?.data || {}
    const storeCookie = await cookies()

    if (result.success) {
      storeCookie.set({
        name: "token",
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      if (refreshToken) {
        storeCookie.set({
          name: "refreshToken",
          value: refreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 60 * 60 * 24 * 30,
        })
      }
    }
    return result
  } catch (error: any) {
    console.error("Registration fetch error:", error)
    return {
      success: false,
      message: error.message || "Network error during registration",
    }
  }
}

export const getUser = async () => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  let decodedData: any = null
  if (token) {
    decodedData = await jwtDecode(token)

    if (decodedData?.userId) {
      try {
        const res = await fetch(`${env.API_URL}/users/${decodedData.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          next: { tags: [`user-${decodedData.userId}`] },
        })
        const result = await res.json()
        if (result.success) {
          return result.data
        }
      } catch (error) {
        console.log("Error fetching full user data:", error)
      }
    }

    return decodedData
  } else {
    return null
  }
}

export const getSuggestedUsers = async () => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/users/suggestions`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 3600 },
    })
    const result = await res.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error("Error fetching suggested users:", error)
    return []
  }
}

export const updateUserProfile = async (userId: string, payload: any) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const res = await fetch(`${env.API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await res.json()

    if (result.success) {
      revalidatePath("/profile", "page")
      revalidatePath("/agency-dashboard/profile", "page")
      revalidateTag(`user-${userId}`, "max")
    }

    return result
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      message: error.message || "Failed to update profile",
    }
  }
}

export const logoutUser = async () => {
  const storeCookie = await cookies()
  storeCookie.delete("token")
  storeCookie.delete("refreshToken")
}

export const getExplorerProfile = async (userId: string) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/users/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { tags: [`explorer-${userId}`], revalidate: 60 },
    })
    const result = await res.json()
    if (result.success) return result.data
    return null
  } catch (error) {
    console.error("Error fetching explorer profile:", error)
    return null
  }
}
