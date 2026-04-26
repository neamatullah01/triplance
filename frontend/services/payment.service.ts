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

export const initiatePayment = async (bookingId: string) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  
  const response = await fetch(`${env.API_URL}/payments/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId }),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to initiate payment gateway")
  }
  return data
}
