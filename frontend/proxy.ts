import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Import your getUser function
import { getUser } from "@/services/auth.service"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for the token (checking both common names)
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value

  let userRole = null
  let isVerified = false

  // 1. Fetch user data if token exists
  if (token) {
    try {
      const user = await getUser()
      if (user) {
        userRole = user.role?.toUpperCase()
        isVerified = user.isVerified || false
      }
    } catch (error) {
      console.error("Middleware getUser error:", error)
      userRole = null // Treat as unauthenticated if fetch fails
    }
  }

  // --------------------------------------------------------
  // RULE A: NOT LOGGED IN
  // --------------------------------------------------------
  if (!userRole) {
    if (
      pathname.startsWith("/admin-dashboard") ||
      pathname.startsWith("/agency-dashboard") ||
      pathname.startsWith("/agency-approval") ||
      pathname.startsWith("/bookings")
    ) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // --------------------------------------------------------
  // RULE B: GLOBAL FORCED REDIRECTS (Home & Auth pages)
  // --------------------------------------------------------
  const isHomeOrAuth =
    pathname === "/" || pathname === "/login" || pathname === "/register"

  if (isHomeOrAuth) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url))
    }
    if (userRole === "AGENCY") {
      return NextResponse.redirect(
        new URL(
          isVerified ? "/agency-dashboard" : "/agency-approval",
          request.url
        )
      )
    }
    // Travelers are allowed to stay on "/"
  }

  // --------------------------------------------------------
  // RULE C: STRICT ROUTE PROTECTION
  // --------------------------------------------------------

  // 1. Admin Dashboard Protection
  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 2. Agency Routes Protection
  if (
    pathname.startsWith("/agency-dashboard") ||
    pathname.startsWith("/agency-approval")
  ) {
    // Kick out Travelers
    if (userRole !== "AGENCY" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Enforce Verification Rules for Agencies
    if (userRole === "AGENCY") {
      // Unverified trying to access dashboard -> Send to approval
      if (pathname.startsWith("/agency-dashboard") && !isVerified) {
        return NextResponse.redirect(new URL("/agency-approval", request.url))
      }

      // Verified trying to access approval -> Send to dashboard
      if (pathname.startsWith("/agency-approval") && isVerified) {
        return NextResponse.redirect(new URL("/agency-dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin-dashboard",
    "/agency-dashboard",
    "/agency-approval",
    "/bookings",
    "/profile",
    "/packages",
    "/services",
    "/tour-guide-profile",
    "/tour-packages",
    // Apply middleware to all routes except api, static files, and images
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
