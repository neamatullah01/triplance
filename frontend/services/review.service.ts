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

export async function createReview(payload: {
  bookingId: string
  rating: number
  comment: string
}) {
  const token = await getToken()

  const res = await fetch(`${env.API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Failed to submit review")
  return data
}

export async function deleteReview(reviewId: string) {
  const token = await getToken()

  const res = await fetch(`${env.API_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Failed to delete review")
  return data
}

export async function getReviewByBookingId(bookingId: string) {
  const token = await getToken()

  const res = await fetch(`${env.API_URL}/reviews/${bookingId}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  })

  const data = await res.json()
  // 404 means no review exists — that's fine, not an error
  if (res.status === 404) return null
  if (!res.ok) throw new Error(data.message || "Failed to fetch review")
  return data
}

/**
 * Fetches all COMPLETED bookings and attaches each booking's review.
 * Returns only bookings that have been reviewed.
 */
export async function getMyReviewedBookings() {
  const token = await getToken()
  if (!token) return []

  // 1. Fetch completed bookings
  const bookingsRes = await fetch(
    `${env.API_URL}/bookings/my?status=COMPLETED`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  )
  const bookingsData = await bookingsRes.json()
  const bookings: any[] = bookingsData?.data || []

  if (bookings.length === 0) return []

  // 2. For each booking, check if a review exists (in parallel)
  const results = await Promise.all(
    bookings.map(async (booking) => {
      try {
        const reviewRes = await fetch(
          `${env.API_URL}/reviews/${booking.id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        )
        if (reviewRes.status === 404) return null
        const reviewData = await reviewRes.json()
        if (!reviewRes.ok || !reviewData?.data) return null
        return { ...booking, review: reviewData.data }
      } catch {
        return null
      }
    })
  )

  // 3. Keep only bookings that have a review
  return results.filter(Boolean)
}
