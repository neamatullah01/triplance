import { StatCard } from "@/components/admin/StatCard"
import { getAgencyStats } from "@/services/agency.service"
import {
  DollarSign,
  CalendarCheck,
  Map,
  Star,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Inbox,
  Activity,
} from "lucide-react"

// Keeping static activity for visual completion until an activity endpoint is built
// (You can set this to an empty array [] to test the empty state!)
const recentActivity = [
  {
    icon: CheckCircle2,
    text: "Booking BK-1024 was confirmed",
    time: "2 hours ago",
    color: "text-emerald-500",
  },
  {
    icon: Users,
    text: "New traveler joined your Sundarbans tour",
    time: "4 hours ago",
    color: "text-indigo-500",
  },
  {
    icon: AlertTriangle,
    text: "Refund request submitted for BK-1019",
    time: "6 hours ago",
    color: "text-amber-500",
  },
  {
    icon: Map,
    text: "Package 'Bandarban Trek' is almost full",
    time: "8 hours ago",
    color: "text-sky-500",
  },
  {
    icon: Star,
    text: "New 5-star review from Amira Khan",
    time: "12 hours ago",
    color: "text-amber-500",
  },
]

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

// Converted to async Server Component to fetch data
export default async function AgencyDashboardPage() {
  // Fetch real data from the backend
  const data = await getAgencyStats()
  const { stats, recentBookings = [] } = data // Default to empty array if undefined

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Agency Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time insights across your agency operations
        </p>
      </div>

      {/* KPI Cards — 1 col mobile → 2 col sm → 4 col lg */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+6.1% from last month"
          changeType="up"
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          change="+12.5% from last month"
          changeType="up"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          label="Active Packages"
          value={stats.activePackages.toString()}
          change="Currently live"
          changeType="neutral"
          icon={Map}
          color="indigo"
        />
        <StatCard
          label="Avg. Rating"
          value={`${stats.avgRating.toFixed(1)} ★`}
          change="Based on traveler reviews"
          changeType="neutral"
          icon={Star}
          color="rose"
        />
      </div>

      {/* Main Grid — stacked mobile → side-by-side lg */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bookings Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Bookings
            </h3>
            <a
              href="/agency-dashboard/bookings"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400"
            >
              View All <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {/* Conditional Rendering for Bookings */}
          {recentBookings && recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:border-slate-800 dark:text-slate-500">
                    <th className="px-4 py-3 sm:px-6">ID</th>
                    <th className="px-4 py-3 sm:px-6">Traveler</th>
                    <th className="hidden px-4 py-3 sm:table-cell sm:px-6">
                      Package
                    </th>
                    <th className="px-4 py-3 sm:px-6">Status</th>
                    <th className="hidden px-4 py-3 sm:px-6 md:table-cell">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right sm:px-6">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking: any) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-50 transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-indigo-600 sm:px-6 dark:text-indigo-400">
                        #{booking.id.substring(0, 6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-900 sm:px-6 dark:text-white">
                        {booking.travelerName}
                      </td>
                      <td className="hidden px-4 py-3.5 text-slate-600 sm:table-cell sm:px-6 dark:text-slate-300">
                        {booking.packageName}
                      </td>
                      <td className="px-4 py-3.5 sm:px-6">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="hidden px-4 py-3.5 text-slate-500 sm:px-6 md:table-cell dark:text-slate-400">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-slate-900 sm:px-6 dark:text-white">
                        ${booking.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State for Bookings */
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Inbox className="h-6 w-6 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                No recent bookings yet
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                When travelers book your packages, they will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
          </div>

          {/* Conditional Rendering for Activity */}
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-5 px-4 py-4 sm:px-6">
              {recentActivity.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-slate-700 dark:text-slate-300">
                        {item.text}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State for Activity */
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Activity className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No recent activity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
