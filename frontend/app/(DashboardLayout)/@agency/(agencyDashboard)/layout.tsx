import { AgencyDashboardShell } from "@/components/agency/agency-dashboard/AgencyDashboardShell"

export default function AgencyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AgencyDashboardShell>{children}</AgencyDashboardShell>
}
