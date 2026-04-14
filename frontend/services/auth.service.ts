"use server";
import { jwtDecode } from "jwt-decode";
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
      cache: "no-cache",
    });
    const result = await res.json();
    const {accessToken, refreshToken} = result?.data || {};
    const storeCookie = await cookies();

    if (result.success) {
      storeCookie.set({
          name: "token",
          value: accessToken,
        //   httpOnly: true,
        //   secure: env.NODE_ENV === "production",
        //   sameSite: "none",
        //   maxAge: 60 * 60 * 24 * 7,
      });
    //   storeCookie.set({
    //       name: "refreshToken",
    //       value: refreshToken,
    //       httpOnly: true,
    //       secure: env.NODE_ENV === "production",
    //       sameSite: "none",
    //       maxAge: 60 * 60 * 24 * 30,
    //   });
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};


export const getUser = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  let decodedData = null;
  if (token) {
    decodedData = await jwtDecode(token);
    return decodedData;
  } else {
    return null;
  }
};