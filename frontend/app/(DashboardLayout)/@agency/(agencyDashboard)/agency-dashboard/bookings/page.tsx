import { Suspense } from "react"
import { getAgencyBookings } from "@/services/booking.service"
import { BookingsFilter } from "@/components/agency/agency-dashboard/bookings/BookingsFilter"
import { BookingsTable } from "@/components/agency/agency-dashboard/bookings/BookingsTable"
// import { PaginationBar } from "@/components/shared/PaginationBar" // Reuse your existing pagination

interface SearchParams {
  searchTerm?: string
  status?: string
  page?: string
  limit?: string
}

export default async function AgencyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // Await the Next.js 15 searchParams Promise
  const resolvedParams = await searchParams

  const page = Number(resolvedParams.page ?? 1)
  const limit = Number(resolvedParams.limit ?? 10)

  // Fetch the data from your new service
  const result = await getAgencyBookings({
    page,
    limit,
    searchTerm: resolvedParams.searchTerm,
    status: resolvedParams.status,
  })

  const bookings = result?.data ?? []
  const meta = result?.meta ?? { page, limit, total: 0 }

  // Extract clean params for the Pagination Component
  const rawSearchParams: Record<string, string> = Object.fromEntries(
    Object.entries(resolvedParams as Record<string, string | undefined>).filter(
      ([, v]) => v !== undefined
    )
  ) as Record<string, string>

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View and manage all incoming traveler bookings
        </p>
      </div>

      {/* Filters + Search (Wrapped in Suspense as it uses useSearchParams) */}
      <Suspense
        fallback={
          <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"></div>
        }
      >
        <BookingsFilter />
      </Suspense>

      {/* Table Component */}
      <BookingsTable bookings={bookings} />

      {/* Pagination (Reuse from Packages) */}
      {/* <PaginationBar meta={meta} searchParams={rawSearchParams} /> */}
    </div>
  )
}
