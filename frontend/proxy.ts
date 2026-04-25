import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Import your getUser function
import { getUser } from "@/services/auth.service"

// Define paths that unauthenticated users are allowed to see
const publicPaths = ["/login", "/register"]

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

  const isPublicPath = publicPaths.includes(pathname)

  // --------------------------------------------------------
  // RULE A: NOT LOGGED IN (Global Lockdown)
  // --------------------------------------------------------
  if (!userRole) {
    // If they are NOT logged in, and trying to access anything other than /login or /register
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    // Let them view the login/register pages
    return NextResponse.next()
  }

  // --------------------------------------------------------
  // RULE B: LOGGED IN BUT TRYING TO ACCESS AUTH PAGES
  // --------------------------------------------------------
  if (isPublicPath) {
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
    // If it's a Traveler (or any other role), send them to the home page
    return NextResponse.redirect(new URL("/", request.url))
  }

  // --------------------------------------------------------
  // RULE C: HOMEPAGE REDIRECTS FOR ADMIN/AGENCY
  // --------------------------------------------------------
  if (pathname === "/") {
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
  // RULE D: STRICT ROUTE PROTECTION FOR LOGGED-IN USERS
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
    "/feed",
    "/explorers/:path*",
    "/explore/:path*",
    "/bookings/:path*",
    "/agency/:path*",
    "/admin-dashboard/:path*",
    "/agency-approval/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
