"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Minus,
  Plus,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

// You would typically pass these as props from your page component
interface BookingCardProps {
  packageId: string
  basePrice: number
  availableDates: string[] // Array of ISO date strings
  bookByDate: string
  maxGroupSize: number
  agencyName: string
}

export function PackageBookingCard({
  packageId = "pkg_987654321",
  basePrice = 12500,
  availableDates = [
    "2026-05-10T00:00:00.000Z",
    "2026-05-17T00:00:00.000Z",
    "2026-05-24T00:00:00.000Z",
  ],
  bookByDate = "2026-07-15T00:00:00.000Z",
  maxGroupSize = 20,
  agencyName = "Test Agency",
}: BookingCardProps) {
  const [selectedDate, setSelectedDate] = useState(availableDates[0] || "")
  const [travelers, setTravelers] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Format date helper (e.g., "Sun, May 10, 2026")
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleBooking = async () => {
    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Preparing secure checkout...")

    // This is the EXACT payload your backend requested
    const payload = {
      packageId: packageId,
      selectedDate: selectedDate,
      numberOfTravelers: travelers,
    }

    try {
      // TODO: Replace this with your actual API call
      console.log("Sending Payload to Backend:", payload)

      // Simulating network request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Redirecting to Payment Gateway...", { id: toastId })

      // router.push(`/checkout?session=${response.data.sessionId}`)
    } catch (error) {
      toast.error("Failed to initialize booking", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="sticky top-24 w-full rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      {/* Price Header */}
      <div className="mb-6">
        <h4 className="mb-1 text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
          Total Price
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
            BDT {(basePrice * travelers).toLocaleString()}
          </span>
          <span className="text-sm font-medium text-slate-500">
            / {travelers} person{travelers > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-5">
        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <Calendar className="h-4 w-4 text-slate-500" />
          Select Date
        </label>
        <div className="relative">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="" disabled>
              Choose a starting date
            </option>
            {availableDates.map((dateStr) => (
              <option key={dateStr} value={dateStr}>
                {formatDate(dateStr)}
              </option>
            ))}
          </select>
          {/* Custom Chevron for select */}
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Traveler Counter (Required for payload) */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Travelers
          </h4>
          <p className="text-xs text-slate-500">Select total persons</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTravelers((p) => Math.max(1, p - 1))}
            disabled={travelers <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
            {travelers}
          </span>
          <button
            onClick={() => setTravelers((p) => Math.min(maxGroupSize, p + 1))}
            disabled={travelers >= maxGroupSize}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info Cards (Matching the image aesthetic) */}
      <div className="mb-4 flex items-center gap-4 rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/20">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-wide text-amber-600 uppercase dark:text-amber-500">
            Book By
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-amber-100">
            {formatDate(bookByDate)}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Group Size
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
            Max {maxGroupSize} people
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleBooking}
        disabled={isSubmitting || !selectedDate}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Make Payment to Confirm"
        )}
      </button>

      {/* Secure Notice */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        Secure payment via Triplance
      </div>

      {/* Organizer Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="text-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organized by
          </p>
          <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-indigo-900 text-[10px] text-white">
              {agencyName.charAt(0)}
            </span>
            {agencyName}
          </div>
        </div>
        <button className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          Contact
        </button>
      </div>
    </div>
  )
}
