import { AgenciesGrid } from "@/components/admin/agencies/AgenciesGrid"
import { getAllUsersAdmin } from "@/services/admin.service"

interface PageProps {
  searchParams: Promise<{ tab?: string }> | { tab?: string }
}

export default async function AgenciesPage(props: PageProps) {
  const searchParams = await props.searchParams
  const queryTab = searchParams?.tab || "all"

  let query = "?role=agency" // Always only fetch agencies
  if (queryTab === "verified") query += "&isVerified=true"
  else if (queryTab === "pending") query += "&isVerified=false"

  const agenciesResponse = await getAllUsersAdmin(query)

  const agencies =
    agenciesResponse.data?.map((u: any) => ({
      id: u.id,
      name: u.name || u.agencyName || "Unknown Agency",
      email: u.email,
      location: u.location || "Not provided",
      verified: u.isVerified,
      rating: u.rating || 0,
      packages: u._count?.packages || u.packages?.length || 0,
      submitted: new Date(u.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      isBanned: u.isBanned,
    })) || []

  return <AgenciesGrid initialAgencies={agencies} currentTab={queryTab} />
}
