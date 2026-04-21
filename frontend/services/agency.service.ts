"use server";

import { env } from "@/lib/env";

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