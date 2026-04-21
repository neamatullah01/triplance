"use server";

import { env } from "@/lib/env";
import { cookies } from "next/headers";

export const getAgencyById = async (id: string) => {
  try {
    const res = await fetch(`${env.API_URL}/users/${id}`, {
      method: "GET",
      // Tag this specific agency so we can revalidate it later when they add a post/package
      next: { tags: [`user-${id}`] }, 
      cache: "no-store", 
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching agency details:", error);
    return { success: false, message: error.message || "Failed to fetch agency details" };
  }
};


export const allAgencyForUser = async (search?: string, page: number = 1, limit: number = 20) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) queryParams.append('search', search);

    const res = await fetch(`${env.API_URL}/users/agencies?${queryParams.toString()}`, {
      method: "GET",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      cache: "no-store"
    });
    const result = await res.json();
    return result.success ? result : { data: [], meta: { page, limit, total: 0 } };
  } catch (error) {
    console.error("Error fetching all agencies:", error);
    return { data: [], meta: { page, limit, total: 0 } };
  }
};