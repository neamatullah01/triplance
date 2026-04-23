import { Edit, Trash2 } from "lucide-react"

// You can move this interface to a shared types file later
export interface PackageData {
  id: string
  title: string
  price: number
  duration: string
  capacity: number
  booked: number
  status: string
  image: string // <-- Added image property
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/90 text-white shadow-sm backdrop-blur-md",
    full: "bg-rose-500/90 text-white shadow-sm backdrop-blur-md",
    inactive: "bg-slate-800/90 text-white shadow-sm backdrop-blur-md",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${styles[status.toLowerCase()] || "bg-slate-500/90 text-white"}`}
    >
      {status}
    </span>
  )
}

export function PackageCard({ pkg }: { pkg: PackageData }) {
  const fillPct = Math.round((pkg.booked / pkg.capacity) * 100)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* --- Image & Floating Badges Header --- */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Left: Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={pkg.status} />
        </div>

        {/* Top Right: Actions (Visible always on mobile, sleek on desktop) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-indigo-600"
            title="Edit Package"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-rose-600"
            title="Delete Package"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- Package Details --- */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3 className="text-base leading-snug font-bold text-slate-900 dark:text-white">
            {pkg.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {pkg.duration} &bull;
          </p>
        </div>

        <p className="mb-5 text-xl font-bold text-indigo-600 sm:text-2xl dark:text-indigo-400">
          ৳{pkg.price.toLocaleString()}
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {" "}
            / traveler
          </span>
        </p>

        {/* Capacity Bar (Pushed to bottom using mt-auto if title is short) */}
        <div className="mt-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
          <div className="mb-2 flex justify-between text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <span>Capacity</span>
            <span className="text-slate-800 dark:text-slate-200">
              {pkg.booked} / {pkg.capacity} Booked
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPct >= 100
                  ? "bg-rose-500"
                  : fillPct >= 80
                    ? "bg-amber-500"
                    : "bg-indigo-500"
              }`}
              style={{ width: `${Math.min(fillPct, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
