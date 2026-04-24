"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"]

export function BookingsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") || "all"
  const currentSearch = searchParams.get("searchTerm") || ""

  // Local state for the search input to prevent immediate URL updates on every keystroke
  const [searchTerm, setSearchTerm] = useState(currentSearch)

  // Update URL when status changes
  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    params.set("page", "1") // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`)
  }

  // Update URL on search submit (Enter key or blur)
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm.trim()) {
      params.set("searchTerm", searchTerm)
    } else {
      params.delete("searchTerm")
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors sm:px-4 ${
              currentStatus === status
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:ml-auto sm:w-auto sm:max-w-xs sm:flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onBlur={handleSearch}
          placeholder="Search bookings..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
        />
      </div>
    </div>
  )
}
