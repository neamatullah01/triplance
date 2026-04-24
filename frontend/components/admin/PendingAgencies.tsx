"use client"

import { useState } from "react"
import { toast } from "sonner"
import { approveAgency, rejectAgency } from "@/services/admin.service"

interface Agency {
  id: string | number
  name: string
  email: string
  submitted: string
  location: string
}

interface PendingAgenciesProps {
  agencies: Agency[]
}

export function PendingAgencies({ agencies }: PendingAgenciesProps) {
  const [loadingAction, setLoadingAction] = useState<{ id: string | number, type: 'approve' | 'reject' } | null>(null)

  const handleApprove = async (id: string | number) => {
    setLoadingAction({ id, type: 'approve' })
    try {
      const res = await approveAgency(id.toString())
      if (res.success) {
        toast.success("Agency approved successfully")
      } else {
        toast.error(res.message || "Failed to approve agency")
      }
    } catch (error) {
      toast.error("An error occurred while approving the agency")
    } finally {
      setLoadingAction(null)
    }
  }

  const handleReject = async (id: string | number) => {
    setLoadingAction({ id, type: 'reject' })
    try {
      const res = await rejectAgency(id.toString())
      if (res.success) {
        toast.success("Agency rejected successfully")
      } else {
        toast.error(res.message || "Failed to reject agency")
      }
    } catch (error) {
      toast.error("An error occurred while rejecting the agency")
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Pending Agency Approvals
          </h3>
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            {agencies.length}
          </span>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {agencies.map((agency) => {
          const isApproving = loadingAction?.id === agency.id && loadingAction.type === 'approve'
          const isRejecting = loadingAction?.id === agency.id && loadingAction.type === 'reject'
          const isLoading = loadingAction?.id === agency.id

          return (
            <div
              key={agency.id}
              className="flex flex-col justify-between gap-3 px-4 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6 dark:hover:bg-slate-800/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                  {agency.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {agency.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {agency.email} &bull; {agency.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="mr-1 hidden text-[11px] text-slate-400 sm:inline">
                  {agency.submitted}
                </span>
                <button
                  onClick={() => handleApprove(agency.id)}
                  disabled={isLoading}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isApproving ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(agency.id)}
                  disabled={isLoading}
                  className="rounded-lg bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
