import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { getAllBookingsAdmin } from "@/services/admin.service";

interface PageProps {
  searchParams: Promise<{ tab?: string }> | { tab?: string };
}

export default async function BookingsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const queryTab = searchParams?.tab || "all";

  let query = "";
  if (queryTab !== "all") {
    query = `?status=${queryTab.toUpperCase()}`;
  }

  const bookingsResponse = await getAllBookingsAdmin(query);

  const bookings = bookingsResponse?.map((b: any) => ({
    id: b.id.substring(0, 8).toUpperCase(), // Extract an 8 char short ID from UUID
    traveler: b.traveler?.name || "Unknown Traveler",
    package: b.package?.title || "Unknown Package",
    agency: b.package?.agency?.name || "Unknown Agency",
    status: b.status.toLowerCase(),
    date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    travelers: b.numberOfTravelers || 1,
    amount: `$${b.totalPrice?.toLocaleString() || "0"}`,
  })) || [];

  return <BookingsTable initialBookings={bookings} currentTab={queryTab} />;
}
