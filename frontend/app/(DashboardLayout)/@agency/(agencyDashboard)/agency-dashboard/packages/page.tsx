import { Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { PackageCard } from "@/components/agency/agency-dashboard/package/PackageCard"
import PackageSearchInput from "@/components/agency/agency-dashboard/package/PackageSearchInput"
import { getMyAgencyPackages } from "@/services/package.service"
import { CreatePackageButton } from "@/components/agency/agency-dashboard/package/CreatePackageButton"

// ─── Types ────────────────────────────────────────────────────────────────────
interface BackendPackage {
  id: string
  title: string
  description?: string
  price: number
  maxCapacity: number
  destination: string
  isActive: boolean
  lastBookingDay?: string | null
  images?: string[]
  availableDates?: string[]
  itinerary?: { day: number; activity: string }[]
  rating?: number
  agency?: {
    id: string
    name: string
    profileImage?: string | null
  }
  _count?: {
    bookings?: number
  }
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function mapToCardData(pkg: BackendPackage) {
  const booked = pkg._count?.bookings ?? 0
  const capacity = pkg.maxCapacity

  // Derive status from isActive + capacity
  let status: string
  if (booked >= capacity) {
    status = "Full"
  } else if (!pkg.isActive) {
    status = "Inactive"
  } else {
    status = "Active"
  }

  // Derive duration from itinerary length, fallback to availableDates count
  const days = pkg.itinerary?.length ?? pkg.availableDates?.length ?? 0
  const duration = days > 0 ? `${days} Day${days > 1 ? "s" : ""}` : "N/A"

  const image =
    (pkg.images && pkg.images.length > 0 ? pkg.images[0] : "") ||
    `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop`

  return {
    id: pkg.id,
    title: pkg.title,
    price: pkg.price,
    duration,
    capacity,
    booked,
    status,
    image,
  }
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function PaginationBar({
  meta,
  searchParams,
}: {
  meta: PaginationMeta
  searchParams: Record<string, string>
}) {
  const totalPages = Math.ceil(meta.total / meta.limit)
  if (totalPages <= 1) return null

  const makeHref = (p: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(p))
    return `?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {meta.page}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {totalPages}
        </span>
        <span className="ml-2 text-xs">({meta.total} total)</span>
      </p>
      <div className="flex gap-2">
        {meta.page > 1 && (
          <Link
            href={makeHref(meta.page - 1)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            ← Prev
          </Link>
        )}
        {meta.page < totalPages && (
          <Link
            href={makeHref(meta.page + 1)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ searchTerm }: { searchTerm?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Plus className="h-7 w-7 text-slate-400" />
      </div>
      {searchTerm ? (
        <>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No packages found for &ldquo;{searchTerm}&rdquo;
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try a different search term
          </p>
          <Link
            href="?page=1"
            className="mt-4 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
          >
            Clear search
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No packages yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Create your first travel package to get started
          </p>
        </>
      )}
    </div>
  )
}

// ─── Page (Server Component) ──────────────────────────────────────────────────
interface SearchParams {
  searchTerm?: string
  destination?: string
  minPrice?: string
  maxPrice?: string
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: string
}

export default async function AgencyPackagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // Next.js 15: searchParams is a Promise — must be awaited
  const resolvedParams = await searchParams

  const page = Number(resolvedParams.page ?? 1)
  const limit = Number(resolvedParams.limit ?? 9)

  const result = await getMyAgencyPackages({
    page,
    limit,
    searchTerm: resolvedParams.searchTerm,
    destination: resolvedParams.destination,
    minPrice: resolvedParams.minPrice
      ? Number(resolvedParams.minPrice)
      : undefined,
    maxPrice: resolvedParams.maxPrice
      ? Number(resolvedParams.maxPrice)
      : undefined,
    sortBy: resolvedParams.sortBy,
    sortOrder: resolvedParams.sortOrder as "asc" | "desc" | undefined,
  })

  const packages: BackendPackage[] = result?.data ?? []
  const meta: PaginationMeta = result?.meta ?? { page, limit, total: 0 }

  // Build a plain object for pagination link generation
  const rawSearchParams: Record<string, string> = Object.fromEntries(
    Object.entries(resolvedParams as Record<string, string | undefined>).filter(
      ([, v]) => v !== undefined
    )
  ) as Record<string, string>

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            Packages
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create, manage, and track your travel packages
          </p>
        </div>
        <CreatePackageButton />
      </div>

      {/* ── Search bar (client island) ── */}
      <Suspense>
        <PackageSearchInput />
      </Suspense>

      {/* ── Stats badge ── */}
      {meta.total > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {packages.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {meta.total}
          </span>{" "}
          packages
          {resolvedParams.searchTerm && (
            <span>
              {" "}
              for &ldquo;
              <span className="text-indigo-600 dark:text-indigo-400">
                {resolvedParams.searchTerm}
              </span>
              &rdquo;
            </span>
          )}
        </p>
      )}

      {/* ── Grid ── */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={mapToCardData(pkg)} />
          ))}
        </div>
      ) : (
        <EmptyState searchTerm={resolvedParams.searchTerm} />
      )}

      {/* ── Pagination ── */}
      <PaginationBar meta={meta} searchParams={rawSearchParams} />
    </div>
  )
}
