"use client"

import { useState } from "react"
import { AlertTriangle, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { deletePackage } from "@/services/package.service"

interface DeletePackageModalProps {
  isOpen: boolean
  packageId: string | null
  packageTitle: string
  onClose: () => void
  onSuccess: () => void
}

export function DeletePackageModal({
  isOpen,
  packageId,
  packageTitle,
  onClose,
  onSuccess,
}: DeletePackageModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const handleDelete = async () => {
    if (!packageId) return

    setIsDeleting(true)
    try {
      await deletePackage(packageId)
      toast.success("Package deleted successfully")
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete package")
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header with Icon */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
            <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Delete Package?
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              "{packageTitle}"
            </span>
            ? This action cannot be undone and will permanently remove it from
            the platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus:ring-2 focus:ring-slate-200 focus:outline-none disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-900"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Yes, Delete Package"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
