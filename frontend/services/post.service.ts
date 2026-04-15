"use server";

import { env } from "@/lib/env";
import { cookies } from "next/headers";

export const createPost = async (postData: any) => {
  try {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;

    const res = await fetch(`${env.API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error creating post in service:", error);
    return { success: false, message: error.message || "Failed to create post" };
  }
};
