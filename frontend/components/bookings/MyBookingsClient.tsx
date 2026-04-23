"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  CalendarDays,
  Users,
  CreditCard,
  MessageCircle,
  Star,
  ChevronRight,
  Clock,
  CheckCircle2,
  Ticket,
  Building2,
  ReceiptText,
} from "lucide-react"

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function MyBookingsClient({
  initialBookings,
}: {
  initialBookings: any[]
}) {
  const [activeTab, setActiveTab] = useState<
    "UPCOMING" | "COMPLETED" | "CANCELLED"
  >("UPCOMING")
  const [bookings, setBookings] = useState(initialBookings)

  const getTabStatus = (booking: any) => {
    if (booking.status === "CANCELLED") return "CANCELLED"
    const dateString = booking.selectedDate || booking.startDate
    if (!dateString) return "UPCOMING"
    const selectedDate = new Date(dateString)
    const now = new Date()
    // Compare dates ignoring time
    now.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    if (selectedDate < now) {
      return "COMPLETED"
    }
    return "UPCOMING"
  }

  const filteredBookings = bookings.filter(
    (b: any) => getTabStatus(b) === activeTab
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-24 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900 dark:text-white">
            <Ticket className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your upcoming trips and review your past adventures.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex w-full max-w-md rounded-2xl bg-slate-200/50 p-1 dark:bg-slate-900">
          {(["UPCOMING", "COMPLETED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-bold transition-colors ${
                activeTab === tab
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="booking-tab-bubble"
                  className="absolute inset-0 rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 capitalize">
                {tab.toLowerCase()}
              </span>
            </button>
          ))}
        </div>

        {/* Booking List */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <motion.article
                  key={booking.id}
                  variants={itemVariants}
                  layout
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md md:flex-row dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Left: Image Thumbnail */}
                  <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-1/3 lg:w-1/4">
                    <img
                      src={
                        booking.package?.images?.[0] ||
                        booking.package?.image ||
                        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                      }
                      alt={booking.package?.title || "Package Image"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      {getTabStatus(booking) === "UPCOMING" && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-indigo-600/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                          <Clock className="h-3.5 w-3.5" /> Upcoming
                        </span>
                      )}
                      {getTabStatus(booking) === "COMPLETED" && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                        </span>
                      )}
                      {getTabStatus(booking) === "CANCELLED" && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-rose-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                          <Clock className="h-3.5 w-3.5" /> Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Booking Details */}
                  <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                    <div>
                      {/* Header Info */}
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                            Booking ID: {booking.id}
                          </p>
                          <h3 className="line-clamp-1 text-xl font-bold text-slate-900 dark:text-white">
                            {booking.package?.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                            <MapPin className="h-4 w-4" />{" "}
                            {booking.package?.destination}
                          </div>
                        </div>

                        {/* Price Badge */}
                        <div className="shrink-0 text-right">
                          <p className="mb-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                            Total Paid
                          </p>
                          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                            {formatPrice(booking.totalPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-800/50">
                        <div>
                          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <CalendarDays className="h-3.5 w-3.5" /> Start Date
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {formatDate(
                              booking.selectedDate || booking.startDate
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Users className="h-3.5 w-3.5" /> Travelers
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {booking.numberOfTravelers || booking.travelers}{" "}
                            Persons
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <CreditCard className="h-3.5 w-3.5" /> Payment
                          </p>
                          <p className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />{" "}
                            {booking.status === "CONFIRMED"
                              ? "PAID"
                              : booking.paymentStatus || booking.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row dark:border-slate-800">
                      {/* Agency Info */}
                      {/* Agency Info */}
                      {booking.package?.agency ? (
                        <div className="flex w-full items-center gap-2 text-sm text-slate-600 sm:w-auto dark:text-slate-300">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          Organized by{" "}
                          <span className="font-bold text-slate-900 dark:text-white">
                            {booking.package.agency.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex w-full items-center gap-2 text-sm text-slate-600 sm:w-auto dark:text-slate-300">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            Triplance Verified
                          </span>
                        </div>
                      )}

                      {/* Dynamic Action Buttons based on Status */}
                      <div className="flex w-full items-center gap-3 sm:w-auto">
                        {getTabStatus(booking) === "UPCOMING" && (
                          <>
                            {booking.package?.agency?.id ? (
                              <Link
                                href={`/agency/${booking.package.agency.id}`}
                                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 sm:flex-none dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                              >
                                <MessageCircle className="h-4 w-4" /> Contact
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-400 sm:flex-none dark:bg-slate-800 dark:text-slate-500"
                              >
                                <MessageCircle className="h-4 w-4" /> Contact
                              </button>
                            )}
                            <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700 sm:flex-none">
                              Details <ChevronRight className="-ml-1 h-4 w-4" />
                            </button>
                          </>
                        )}

                        {getTabStatus(booking) === "COMPLETED" && (
                          <>
                            <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 sm:flex-none dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                              <ReceiptText className="h-4 w-4" /> Invoice
                            </button>
                            <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-amber-500/20 transition-colors hover:bg-amber-600 sm:flex-none">
                              <Star className="h-4 w-4 fill-white" /> Leave
                              Review
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              /* Empty State */
              <motion.div
                variants={itemVariants}
                className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 py-20 text-center dark:border-slate-800 dark:bg-slate-900/50"
              >
                <Ticket className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                  No {activeTab.toLowerCase()} bookings found
                </h3>
                <p className="mx-auto max-w-sm text-slate-500 dark:text-slate-400">
                  {activeTab === "UPCOMING"
                    ? "You don't have any upcoming trips. Time to start exploring packages!"
                    : "You haven't completed any trips yet."}
                </p>
                {activeTab === "UPCOMING" && (
                  <button className="mt-6 cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700">
                    Explore Packages
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
