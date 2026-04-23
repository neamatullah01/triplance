"use server"

import { cookies } from "next/headers"

import { env } from "@/lib/env"

export const getPackages = async (
  page: number = 1,
  limit: number = 10,
  destination?: string
) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (destination) params.set("destination", destination)
    const res = await fetch(`${env.API_URL}/packages?${params.toString()}`, {
      method: "GET",
      next: { tags: ["packages"] },
      cache: "no-store",
    })

    const result = await res.json()
    return result
  } catch (error: any) {
    console.error("Error fetching packages:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch packages",
    }
  }
}

export const getPackageById = async (id: string) => {
  try {
    const res = await fetch(`${env.API_URL}/packages/${id}`, {
      method: "GET",
      next: { tags: [`package-${id}`] },
      cache: "no-store",
    })

    const result = await res.json()
    return result
  } catch (error: any) {
    console.error("Error fetching package:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch package",
    }
  }
}

export interface AgencyPackageQuery {
  page?: number
  limit?: number
  searchTerm?: string
  destination?: string
  title?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export const getMyAgencyPackages = async (query: AgencyPackageQuery = {}) => {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value

  try {
    const params = new URLSearchParams()
    if (query.page) params.set("page", String(query.page))
    if (query.limit) params.set("limit", String(query.limit))
    if (query.searchTerm) params.set("searchTerm", query.searchTerm)
    if (query.destination) params.set("destination", query.destination)
    if (query.title) params.set("title", query.title)
    if (query.minPrice) params.set("minPrice", String(query.minPrice))
    if (query.maxPrice) params.set("maxPrice", String(query.maxPrice))
    if (query.sortBy) params.set("sortBy", query.sortBy)
    if (query.sortOrder) params.set("sortOrder", query.sortOrder)

    const res = await fetch(
      `${env.API_URL}/packages/my-packages?${params.toString()}`,
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      }
    )

    const result = await res.json()
    return result
  } catch (error: any) {
    console.error("Error fetching agency packages:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch packages",
    }
  }
}

export async function createPackage(payload: any) {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value

  const response = await fetch(`${env.API_URL}/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to create package")
  }

  return data
}

export async function updatePackage(packageId: string, payload: any) {
  const storeCookie = await cookies()
  const token = storeCookie.get("token")?.value
  const response = await fetch(`${env.API_URL}/packages/${packageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to update package")
  return data
}
