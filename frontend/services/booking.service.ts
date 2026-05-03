"use server"

import { cookies } from "next/headers"
import { env } from "@/lib/env"

const getToken = async () => {
  const storeCookie = await cookies()
  return (
    storeCookie.get("token")?.value ||
    storeCookie.get("better-auth.session_token")?.value ||
    storeCookie.get("__Secure-better-auth.session_token")?.value
  )
}

export const getUserBookings = async (status?: string) => {
  const token = await getToken()
  try {
    const searchParams = new URLSearchParams()
    if (status) searchParams.set("status", status)

    const query = searchParams.toString()
    const url = `${env.API_URL}/bookings/my${query ? `?${query}` : ""}`

    const res = await fetch(url, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { tags: ["my-bookings"], revalidate: 0 },
    })
    const result = await res.json()
    return result
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return null
  }
}

export async function getAgencyBookings(params: Record<string, any>) {
  const token = await getToken()
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, String(value))
  })

  const response = await fetch(
    `${env.API_URL}/bookings/agency?${searchParams.toString()}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to fetch bookings")

  return data
}

export async function createBooking(payload: any) {
  const token = await getToken()

  const response = await fetch(`${env.API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (response.status === 401) {
    throw new Error("You must be logged in to book a package.")
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to create booking")
  }

  return data
}
