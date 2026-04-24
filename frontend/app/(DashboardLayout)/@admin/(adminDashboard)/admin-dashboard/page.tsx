import { StatCard } from "@/components/admin/StatCard"
import { RecentBookings } from "@/components/admin/RecentBookings"
import { RecentActivity } from "@/components/admin/RecentActivity"
import { PendingAgencies } from "@/components/admin/PendingAgencies"
import { getAdminStats, getPendingAgencies, getAllBookingsAdmin } from "@/services/admin.service"
import {
  Users,
  CalendarCheck,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react"

// FALLBACK MOCK DATA
const mockRecentBookings = [
  {
    id: "BK-1024",
    traveler: "Sarah Jenkins",
    package: "Patagonia Circuit",
    status: "confirmed",
    date: "Apr 6, 2026",
    amount: "$2,400",
  },
  {
    id: "BK-1023",
    traveler: "Marco Rossi",
    package: "Kyoto Temple Trail",
    status: "pending",
    date: "Apr 5, 2026",
    amount: "$1,800",
  },
]

const recentActivity = [
  {
    icon: CheckCircle2,
    text: "Booking BK-1024 was confirmed",
    time: "2 hours ago",
    color: "text-emerald-500",
  },
  {
    icon: Users,
    text: "New traveler registered: Priya Sharma",
    time: "4 hours ago",
    color: "text-indigo-500",
  },
  {
    icon: AlertTriangle,
    text: "Refund request for BK-1019",
    time: "6 hours ago",
    color: "text-amber-500",
  },
  {
    icon: Building2,
    text: "New agency application: EcoStay Travels",
    time: "8 hours ago",
    color: "text-sky-500",
  },
]

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()
  const agencies = await getPendingAgencies()
  const bookings = await getAllBookingsAdmin("?limit=5&sortBy=createdAt&sortOrder=desc")

  const agenciesData = agencies.data || [];
  const bookingsData = bookings.data || [];

  // Map API response to Component props or use Fallback
  const displayAgencies = agenciesData?.length > 0 ? agenciesData.map((a: any) => ({
    id: a.id,
    name: a.name || a.agencyName || "Unknown Agency",
    email: a.email,
    submitted: new Date(a.createdAt).toLocaleDateString(),
    location: a.location || "Location not provided",
  })) : []

  const displayBookings = bookingsData?.length > 0 ? bookingsData.map((b: any) => ({
    id: b.id.substring(0, 8).toUpperCase(),
    traveler: b.user?.name || "Traveler",
    package: b.package?.title || "Package",
    status: b.status || "pending",
    date: new Date(b.createdAt).toLocaleDateString(),
    amount: `$${b.totalPrice || 0}`,
  })) : mockRecentBookings

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Platform Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time insights across the Triplance platform
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers || "12,847"}
          change="+8.2% from last month"
          changeType="up"
          icon={Users}
          color="indigo"
        />
        <StatCard
          label="Total Bookings"
          value={stats?.totalBookings || "3,624"}
          change="+12.5% from last month"
          changeType="up"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          label="Revenue"
          value={`$${stats?.totalRevenue || "284,900"}`}
          change="+6.1% from last month"
          changeType="up"
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          label="Pending Agencies"
          value={stats?.pendingAgenciesCount || displayAgencies.length}
          change="Awaiting approval"
          changeType="neutral"
          icon={Building2}
          color="rose"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentBookings bookings={displayBookings} />
        <RecentActivity activities={recentActivity} />
      </div>

      {/* Pending Agency Approvals */}
      {displayAgencies.length > 0 ? (
        <PendingAgencies agencies={displayAgencies} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-12 shadow-sm sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <Building2 className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Pending Approvals
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            There are currently no new travel agencies waiting for approval.
          </p>
        </div>
      )}
    </div>
  )
}
