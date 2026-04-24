import { UsersTable } from "@/components/admin/users/UsersTable"
import { getAllUsersAdmin } from "@/services/admin.service"

interface PageProps {
  searchParams: Promise<{ tab?: string }> | { tab?: string }
}

export default async function UsersPage(props: PageProps) {
  const searchParams = await props.searchParams
  const queryTab = searchParams?.tab || "all"

  let query = ""
  if (queryTab === "travelers") query = "?role=traveler"
  else if (queryTab === "agencies") query = "?role=agency"
  else if (queryTab === "banned") query = "?tab=banned"

  const usersResponse = await getAllUsersAdmin(query)

  // Map API response to Component props
  const users =
    usersResponse?.map((u: any) => ({
      id: u.id,
      name: u.name || u.agencyName || "Unknown",
      email: u.email,
      role: u.role || "traveler",
      status: u.isBanned
        ? "banned"
        : !u.isVerified && u.role === "agency"
          ? "pending"
          : "active",
      joined: new Date(u.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      bookings: u._count?.bookings || u.bookings?.length || 0,
    })) || []

  return <UsersTable initialUsers={users} currentTab={queryTab} />
}
