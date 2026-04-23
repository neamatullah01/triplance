"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Search, X } from "lucide-react"

export default function PackageSearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const searchTerm = searchParams.get("searchTerm") ?? ""

  const updateParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("searchTerm", value)
      } else {
        params.delete("searchTerm")
      }
      // Reset to page 1 when search changes
      params.set("page", "1")
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="relative max-w-sm">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search packages..."
        defaultValue={searchTerm}
        onChange={(e) => updateParam(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm transition-all focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900"
      />
      {isPending && (
        <span className="absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      )}
      {!isPending && searchTerm && (
        <button
          onClick={() => updateParam("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
