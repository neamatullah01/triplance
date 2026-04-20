"use server";

import { env } from "@/lib/env";

export const getPackages = async (page: number = 1, limit: number = 10, destination?: string) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (destination) params.set("destination", destination);
    const res = await fetch(`${env.API_URL}/packages?${params.toString()}`, {
      method: "GET",
      next: { tags: ["packages"] },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    return { success: false, message: error.message || "Failed to fetch packages" };
  }
};