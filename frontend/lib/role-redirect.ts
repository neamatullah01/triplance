import { getUser } from "@/services/auth.service"

export async function getRedirectPathByRole(role?: string) {
  if (!role) return "/"

  switch (role.toUpperCase()) {
    case "ADMIN":
      return "/admin-dashboard"
    case "AGENCY":
      // For agency, we need to check if they are verified
      const user = await getUser()
      const isVerified = user?.isVerified
      return isVerified ? "/agency-dashboard" : "/agency-approval"
    case "TRAVELER":
    default:
      return "/" // Home page
  }
}
