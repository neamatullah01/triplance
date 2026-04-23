"use server"

import { cookies } from "next/headers"
import { env } from "@/lib/env"

export const getUserBookings = async () => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/bookings/my`, {
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
