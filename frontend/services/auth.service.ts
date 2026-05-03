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

  // ── 1. Standard JWT path (email/password login) ──────────────────────────
  const jwtToken = storeCookie.get("token")?.value
  if (jwtToken) {
    let decodedData: any = null
    try {
      decodedData = jwtDecode(jwtToken)
    } catch {
      // Not a valid JWT – fall through
    }

    if (decodedData?.userId) {
      try {
        const res = await fetch(`${env.API_URL}/users/${decodedData.userId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
          next: { tags: [`user-${decodedData.userId}`] },
        })
        const result = await res.json()
        if (result.success) return result.data
      } catch (error) {
        console.log("Error fetching full user data:", error)
      }
    }

    if (decodedData) return decodedData
  }

  // ── 2. BetterAuth opaque session token path (Google OAuth) ───────────────
  const betterAuthToken =
    storeCookie.get("better-auth.session_token")?.value ||
    storeCookie.get("__Secure-better-auth.session_token")?.value

  if (betterAuthToken) {
    try {
      // Ask BetterAuth for the session; forward the cookie so it can validate it
      const cookieHeader = storeCookie
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ")

      const res = await fetch(
        `${env.API_URL?.replace("/api/v1", "")}/api/auth/get-session`,
        {
          headers: { Cookie: cookieHeader },
          cache: "no-store",
        }
      )

      if (res.ok) {
        const session = await res.json()
        // BetterAuth returns { user: { id, email, name, ... }, session: {...} }
        if (session?.user) {
          return {
            userId: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role || "TRAVELER",
            isVerified: session.user.emailVerified ?? true,
            profilePhoto: session.user.image,
          }
        }
      }
    } catch (error) {
      console.log("Error fetching BetterAuth session:", error)
    }
  }

  return null
}

export const getSuggestedUsers = async () => {
  const storeCookie = await cookies()
  const token =
    storeCookie.get("token")?.value ||
    storeCookie.get("better-auth.session_token")?.value ||
    storeCookie.get("__Secure-better-auth.session_token")?.value

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
    const token =
      cookieStore.get("token")?.value ||
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value
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

  // ── 1. BetterAuth server-side sign-out (Google OAuth users) ──────────────
  const isBetterAuthUser =
    !!storeCookie.get("better-auth.session_token")?.value ||
    !!storeCookie.get("__Secure-better-auth.session_token")?.value

  if (isBetterAuthUser) {
    try {
      const cookieHeader = storeCookie
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ")

      await fetch(
        `${env.API_URL?.replace("/api/v1", "")}/api/auth/sign-out`,
        {
          method: "POST",
          headers: {
            Cookie: cookieHeader,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      )
    } catch (error) {
      console.error("BetterAuth sign-out error:", error)
    }
  }

  // ── 2. Delete all auth cookies ────────────────────────────────────────────
  // JWT cookies (standard attributes)
  try { storeCookie.delete("token") } catch {}
  try { storeCookie.delete("refreshToken") } catch {}

  // BetterAuth cookies – must match the attributes the backend originally set.
  // In production with SameSite=None + Secure + Partitioned, we must pass
  // those same attributes when deleting or the browser won't clear them.
  const betterAuthCookieNames = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    "better-auth.session_data",
    "__Secure-better-auth.session_data",
  ]

  for (const name of betterAuthCookieNames) {
    try {
      storeCookie.set({
        name,
        value: "",
        maxAge: 0,
        path: "/",
        secure: true,
        sameSite: "none" as const,
        httpOnly: true,
      })
    } catch {
      // Cookie may not exist or attributes may mismatch — that's OK
      try { storeCookie.delete(name) } catch {}
    }
  }
}

export const getExplorerProfile = async (userId: string) => {
  const storeCookie = await cookies()
  const token =
    storeCookie.get("token")?.value ||
    storeCookie.get("better-auth.session_token")?.value ||
    storeCookie.get("__Secure-better-auth.session_token")?.value
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

