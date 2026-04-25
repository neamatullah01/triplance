import { Metadata } from "next"
import { redirect } from "next/navigation"
import { MyBookingsClient } from "@/components/bookings/MyBookingsClient"
import { getUser } from "@/services/auth.service"
import { getUserBookings } from "@/services/booking.service"

export const metadata: Metadata = {
  title: "My Bookings | Triplance",
  description:
    "Manage your upcoming trips, view invoices, and review your past adventures on Triplance.",
}

export default async function BookingsPage() {
  // 1. Verify the user is logged in before showing their private bookings
  const user = await getUser()

  if (!user) {
    redirect("/login") // Redirect to your login/auth page if they aren't authenticated
  }

  // 2. Pre-fetch CONFIRMED bookings for the default "Upcoming" tab
  const response = await getUserBookings("CONFIRMED");
  const userBookings = response?.data || [];

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* 
        Pass the fetched data to the client component. 
      */}
      <MyBookingsClient
        initialBookings={userBookings}
      />
    </main>
  )
}
