import { getUser } from "@/services/auth.service"

export async function getRedirectPathByRole(role?: string) {
  const user = await getUser()
  const isVerified = user?.isVerified
  if (!user) return "/login"
  if (!role) return "/"

  switch (role.toUpperCase()) {
    case "ADMIN":
      return "/admin-dashboard"
    case "AGENCY":
      return isVerified ? "/agency-dashboard" : "/agency-approval"
    case "TRAVELER":
    default:
      return "/" // Home page
  }
}
