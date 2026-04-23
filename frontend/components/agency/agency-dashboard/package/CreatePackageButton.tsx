"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { CreatePackageModal } from "./CreatePackageModal" // Ensure path matches your setup

export function CreatePackageButton() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-colors hover:cursor-pointer hover:bg-indigo-700 sm:self-auto sm:px-5"
      >
        <Plus className="h-4 w-4" />
        Add New Package
      </button>

      <CreatePackageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false)
          // Refresh the page data asynchronously without doing a hard reload
          router.refresh()
        }}
      />
    </>
  )
}
