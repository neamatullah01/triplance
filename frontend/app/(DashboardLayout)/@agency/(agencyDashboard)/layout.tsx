import { AgencyDashboardShell } from "@/components/agency/AgencyDashboardShell";

export default function AgencyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgencyDashboardShell>{children}</AgencyDashboardShell>;
}
