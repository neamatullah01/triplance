import { Eye, Mail, Inbox } from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    completed: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${styles[status?.toLowerCase()] || "bg-slate-100 text-slate-700"}`}
    >
      {status}
    </span>
  )
}

export function BookingsTable({ bookings }: { bookings: any[] }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Inbox className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No bookings found
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:border-slate-800 dark:text-slate-500">
              <th className="px-4 py-3 sm:px-6">Booking ID</th>
              <th className="px-4 py-3 sm:px-6">Traveler</th>
              <th className="hidden px-4 py-3 sm:px-6 md:table-cell">
                Package
              </th>
              <th className="px-4 py-3 sm:px-6">Status</th>
              <th className="hidden px-4 py-3 sm:px-6 lg:table-cell">Date</th>
              <th className="px-4 py-3 text-right sm:px-6">Amount</th>
              <th className="px-4 py-3 text-right sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
              >
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-indigo-600 sm:px-6 dark:text-indigo-400">
                  #{booking.id.substring(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-900 sm:px-6 dark:text-white">
                  {booking.traveler?.name || "Unknown Traveler"}
                  <div className="text-[10px] font-normal text-slate-500">
                    {booking.traveler?.email}
                  </div>
                </td>
                <td className="hidden px-4 py-3.5 text-slate-600 sm:px-6 md:table-cell dark:text-slate-300">
                  {booking.package?.title}
                </td>
                <td className="px-4 py-3.5 sm:px-6">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="hidden px-4 py-3.5 text-slate-500 sm:px-6 lg:table-cell dark:text-slate-400">
                  {new Date(booking.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-slate-900 sm:px-6 dark:text-white">
                  {/* Assumes backend passes 'totalPrice', adjust if needed */}৳
                  {(
                    booking.totalPrice ||
                    booking.package?.price ||
                    0
                  ).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {/* Replaced Cancel with Contact */}
                    <button
                      className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                      title="Contact Traveler"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
