"use server";

import { FieldValues } from "react-hook-form";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${env.AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await res.json();
    const {accessToken, refreshToken} = result?.data || {};
    const storeCookie = await cookies();

    if (result.success) {
      storeCookie.set({
          name: "accessToken",
          value: accessToken,
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          sameSite: "none",
      });
      storeCookie.set({
          name: "refreshToken",
          value: refreshToken,
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          sameSite: "none",
      });
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};
