"use server"

import { cookies } from "next/headers"

/**
 * Returns the active auth token regardless of login method:
 *  - JWT "token" cookie  →  email/password login
 *  - BetterAuth session cookies  →  Google OAuth login
 *
 * Pass this as `Authorization: Bearer <token>` to your backend.
 * Note: BetterAuth opaque session tokens won't be validated by your
 * custom JWT middleware, so the backend must also accept BetterAuth
 * session-cookie validation for protected routes (or you handle it
 * by forwarding cookies). For now we return whatever is present so
 * the header is at least set.
 */
export const getAuthToken = async (): Promise<string | undefined> => {
  const storeCookie = await cookies()
  return (
    storeCookie.get("token")?.value ||
    storeCookie.get("better-auth.session_token")?.value ||
    storeCookie.get("__Secure-better-auth.session_token")?.value
  )
}

/**
 * Returns all cookies as a header string so BetterAuth-protected
 * endpoints can validate the session server-side.
 */
export const getCookieHeader = async (): Promise<string> => {
  const storeCookie = await cookies()
  return storeCookie
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")
}
