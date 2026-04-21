"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Star,
  CalendarDays,
  Users,
  CheckCircle2,
  Map,
  Clock,
  ShieldCheck,
  Building2,
  ChevronDown,
  AlertCircle,
  Minus,
  Plus,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export function PackageDetailsClient({ pkg }: { pkg: any }) {
  const [selectedDate, setSelectedDate] = useState(
    pkg.availableDates?.[0] || ""
  )
  const [travelers, setTravelers] = useState(1)
  const [isBooking, setIsBooking] = useState(false)

  const maxCapacity = pkg.maxCapacity || 20

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

  const handleBookNow = async () => {
    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }

    setIsBooking(true)
    const toastId = toast.loading("Preparing secure checkout...")

    // ✅ EXACT PAYLOAD FOR YOUR BACKEND
    const payload = {
      packageId: pkg.id,
      selectedDate: selectedDate, // Sending the raw ISO string
      numberOfTravelers: travelers,
    }

    try {
      console.log("Sending Payload to Backend:", payload)

      // TODO: Replace this timeout with your actual API POST request
      // const response = await bookPackage(payload);

      setTimeout(() => {
        toast.success("Redirecting to Payment Gateway...", { id: toastId })
        setIsBooking(false)
      }, 1500)
    } catch (error) {
      toast.error("Booking failed. Please try again.", { id: toastId })
      setIsBooking(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* 1. Hero Image Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-slate-900">
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-3 flex flex-wrap items-center gap-4 text-slate-200"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-md">
                <MapPin className="h-4 w-4" />
                {pkg.destination}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-orange-500/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                <Star className="h-4 w-4 fill-white" />
                {pkg.rating > 0 ? pkg.rating : "New"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl"
            >
              {pkg.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column: Details (Takes up 2/3 space) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12 lg:col-span-2"
          >
            {/* Overview */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Overview
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {pkg.description}
              </p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                What's Included
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {pkg.amenities.map((amenity: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary Timeline */}
            <section>
              <div className="mb-6 flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Itinerary
                </h2>
                <Map className="h-6 w-6 text-indigo-500" />
              </div>

              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-indigo-200 before:to-transparent md:before:mx-auto md:before:translate-x-0 dark:before:via-indigo-800">
                {pkg.itinerary.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="group is-active relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                  >
                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-slate-50 bg-indigo-100 font-bold text-indigo-600 shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:border-slate-950 dark:bg-indigo-900/50 dark:text-indigo-400">
                      {item.day}
                    </div>
                    <div className="w-[calc(100%-4rem)] rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow group-hover:shadow-md md:w-[calc(50%-2.5rem)] dark:border-slate-800 dark:bg-slate-900">
                      <h4 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                        Day {item.day}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {item.activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 md:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              {/* ✅ Dynamic Price Header */}
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Total Price
                </span>
                <div className="mt-1 flex items-end gap-2">
                  <h3 className="text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                    {formatPrice(pkg.price * travelers)}
                  </h3>
                  <span className="pb-1 font-medium whitespace-nowrap text-slate-500 dark:text-slate-400">
                    / {travelers} person{travelers > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Selection Form */}
              <div className="mb-8 space-y-4">
                {/* Dates */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <CalendarDays className="h-4 w-4 text-slate-500" /> Select
                    Date
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-10 pl-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {pkg.availableDates.map((date: string) => (
                        <option key={date} value={date}>
                          {formatDate(date)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* ✅ Traveler Counter */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Travelers
                    </h4>
                    <p className="text-xs text-slate-500">
                      Select total persons
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTravelers((p) => Math.max(1, p - 1))}
                      disabled={travelers <= 1}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
                      {travelers}
                    </span>
                    <button
                      onClick={() =>
                        setTravelers((p) => Math.min(maxCapacity, p + 1))
                      }
                      disabled={travelers >= maxCapacity}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Last Booking Day */}
                {pkg.lastBookingDay &&
                  (() => {
                    const deadline = new Date(pkg.lastBookingDay)
                    const isExpired = deadline < new Date()
                    const deadlineStr = deadline.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    return (
                      <div
                        className={`flex items-center gap-3 rounded-xl border p-4 ${
                          isExpired
                            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                            : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                        }`}
                      >
                        <div
                          className={`shrink-0 rounded-lg p-2 ${
                            isExpired
                              ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                              : "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                          }`}
                        >
                          {isExpired ? (
                            <AlertCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold tracking-wider uppercase ${
                              isExpired
                                ? "text-red-500"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {isExpired ? "Booking Closed" : "Book By"}
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              isExpired
                                ? "text-red-700 dark:text-red-300"
                                : "text-slate-900 dark:text-slate-100"
                            }`}
                          >
                            {deadlineStr}
                          </p>
                        </div>
                      </div>
                    )
                  })()}

                {/* Capacity Info */}
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                        Group Size
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Max {maxCapacity} people
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ UPDATED BUTTON */}
              <button
                onClick={handleBookNow}
                disabled={
                  isBooking ||
                  (pkg.lastBookingDay &&
                    new Date(pkg.lastBookingDay) < new Date())
                }
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isBooking ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                  </span>
                ) : (
                  <>Make Payment to Confirm</>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Secure payment via Triplance
              </div>

              {/* Agency Info */}
              <hr className="my-6 border-slate-200 dark:border-slate-800" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-0.5 text-xs font-medium text-slate-500">
                    Organized by
                  </p>
                  <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-indigo-900 text-[10px] text-white">
                      {pkg.agency?.name?.charAt(0) || "A"}
                    </span>
                    {pkg.agency?.name || "Agency"}
                  </p>
                </div>
                <button className="cursor-pointer rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100">
                  <Link href={`/agency/${pkg.agency?.id}`}>Contact</Link>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
