"use server"

import { cookies } from "next/headers"
import { env } from "@/lib/env"

export const getAllPaymentsAdmin = async (query = "") => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  try {
    const res = await fetch(`${env.API_URL}/payments${query}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 0 },
    })
    const result = await res.json()
    return result.success ? { data: result.data, meta: result.meta } : { data: [], meta: null }
  } catch (error) {
    console.error("Error fetching admin payments:", error)
    return { data: [], meta: null }
  }
}
