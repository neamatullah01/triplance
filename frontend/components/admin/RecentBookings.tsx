import { ArrowUpRight } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

interface Booking {
  id: string
  traveler: string
  package: string
  status: string
  date: string
  amount: string
}

interface RecentBookingsProps {
  bookings: Booking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Recent Bookings
        </h3>
        <a
          href="/admin/bookings"
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400"
        >
          View All <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:border-slate-800 dark:text-slate-500">
              <th className="px-4 py-3 sm:px-6">Booking ID</th>
              <th className="px-4 py-3 sm:px-6">Traveler</th>
              <th className="hidden px-4 py-3 sm:table-cell sm:px-6">
                Package
              </th>
              <th className="px-4 py-3 sm:px-6">Status</th>
              <th className="hidden px-4 py-3 sm:px-6 md:table-cell">Date</th>
              <th className="px-4 py-3 text-right sm:px-6">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
              >
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-indigo-600 sm:px-6 dark:text-indigo-400">
                  {b.id}
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-900 sm:px-6 dark:text-white">
                  {b.traveler}
                </td>
                <td className="hidden px-4 py-3.5 text-slate-600 sm:table-cell sm:px-6 dark:text-slate-300">
                  {b.package}
                </td>
                <td className="px-4 py-3.5 sm:px-6">
                  <StatusBadge status={b.status} />
                </td>
                <td className="hidden px-4 py-3.5 text-slate-500 sm:px-6 md:table-cell dark:text-slate-400">
                  {b.date}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-slate-900 sm:px-6 dark:text-white">
                  {b.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
