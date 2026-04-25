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
    const result = await res.json()
    const { accessToken, refreshToken } = result?.data || {}
    const storeCookie = await cookies()

    if (result.success) {
      storeCookie.set({
        name: "token",
        value: accessToken,
        //   httpOnly: true,
        //   secure: env.NODE_ENV === "production",
        //   sameSite: "none",
        //   maxAge: 60 * 60 * 24 * 7,
      })
      //   storeCookie.set({
      //       name: "refreshToken",
      //       value: refreshToken,
      //       httpOnly: true,
      //       secure: env.NODE_ENV === "production",
      //       sameSite: "none",
      //       maxAge: 60 * 60 * 24 * 30,
      //   });
    }
    return result
  } catch (error) {
    console.log(error)
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
    const result = await res.json()
    const { accessToken, refreshToken } = result?.data || {}
    const storeCookie = await cookies()

    if (result.success) {
      storeCookie.set({
        name: "token",
        value: accessToken,
        //   httpOnly: true,
        //   secure: env.NODE_ENV === "production",
        //   sameSite: "none",
        //   maxAge: 60 * 60 * 24 * 7,
      })
      //   storeCookie.set({
      //       name: "refreshToken",
      //       value: refreshToken,
      //       httpOnly: true,
      //       secure: env.NODE_ENV === "production",
      //       sameSite: "none",
      //       maxAge: 60 * 60 * 24 * 30,
      //   });
    }
    return result
  } catch (error) {
    console.log(error)
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
