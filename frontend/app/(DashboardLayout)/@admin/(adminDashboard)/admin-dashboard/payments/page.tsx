import { PaymentsTable } from "@/components/admin/payments/PaymentsTable";
import { getAllPaymentsAdmin } from "@/services/payment.service";

interface PageProps {
  searchParams: Promise<{ tab?: string }> | { tab?: string };
}

export default async function PaymentsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const queryTab = searchParams?.tab || "all";

  // Fetch all to compute summary properly
  const allPaymentsResponse = await getAllPaymentsAdmin("?limit=1000");
  const allPayments = allPaymentsResponse || [];

  const summary = {
    totalPaid: allPayments.filter((p: any) => p.status === "PAID").reduce((s: number, p: any) => s + p.amount, 0),
    totalRefunded: allPayments.filter((p: any) => p.status === "REFUNDED").reduce((s: number, p: any) => s + p.amount, 0),
    totalPending: allPayments.filter((p: any) => p.status === "UNPAID" || p.status === "PENDING").reduce((s: number, p: any) => s + p.amount, 0),
  };

  // Filter for the list based on queryTab
  let query = "?limit=50";
  if (queryTab !== "all") {
    query += `&status=${queryTab.toUpperCase()}`;
  }
  const listResponse = await getAllPaymentsAdmin(query);

  const payments = listResponse?.map((p: any) => ({
    id: p.id.substring(0, 8).toUpperCase(),
    bookingId: p.booking?.id?.substring(0, 8).toUpperCase() || "—",
    traveler: p.traveler?.name || "Unknown Traveler",
    amount: `$${p.amount?.toLocaleString() || "0"}`,
    status: p.status.toLowerCase(),
    gateway: p.gateway || "—",
    transactionId: p.transactionId || "—",
    date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  })) || [];

  return <PaymentsTable initialPayments={payments} currentTab={queryTab} summary={summary} />;
}
