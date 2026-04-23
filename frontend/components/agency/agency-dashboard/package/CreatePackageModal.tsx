"use client"

import { useState, useRef } from "react"
import {
  X,
  Plus,
  Trash2,
  UploadCloud,
  Calendar,
  MapPin,
  DollarSign,
  Users,
} from "lucide-react"
import { toast } from "sonner" // <-- Import the service
import { createPackage } from "@/services/package.service"

interface CreatePackageModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Utility to convert File to Base64 String
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function CreatePackageModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePackageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [maxCapacity, setMaxCapacity] = useState("")
  const [destination, setDestination] = useState("")
  const [lastBookingDay, setLastBookingDay] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Dynamic Arrays State
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [newDate, setNewDate] = useState("")

  const [amenities, setAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState("")

  const [itinerary, setItinerary] = useState<
    { day: number; activity: string }[]
  >([])
  const [newActivity, setNewActivity] = useState("")

  if (!isOpen) return null

  const handleAddDate = () => {
    if (newDate && !availableDates.includes(newDate)) {
      setAvailableDates([...availableDates, newDate])
      setNewDate("")
    }
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const handleAddItinerary = () => {
    if (newActivity.trim()) {
      setItinerary([
        ...itinerary,
        { day: itinerary.length + 1, activity: newActivity.trim() },
      ])
      setNewActivity("")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile) return toast.error("Please upload an image.")
    if (availableDates.length === 0)
      return toast.error("Add at least one available date.")
    if (amenities.length === 0) return toast.error("Add at least one amenity.")
    if (itinerary.length === 0)
      return toast.error("Add at least one itinerary day.")

    setIsLoading(true)

    try {
      // 1. Convert Image to Base64
      const base64Image = await convertToBase64(imageFile)

      // 2. Construct the exact JSON payload
      const payload = {
        title,
        description,
        price: Number(price),
        maxCapacity: Number(maxCapacity),
        destination,
        lastBookingDay: new Date(lastBookingDay).toISOString(),
        availableDates: availableDates.map((d) => new Date(d).toISOString()),
        amenities,
        images: [base64Image],
        itinerary,
      }

      // 3. Call API via Service
      await createPackage(payload)

      toast.success("Package created successfully!")
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to create package.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Create New Package
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:ring-2 focus:ring-slate-200 focus:outline-none dark:hover:bg-slate-800 dark:hover:text-slate-300 dark:focus:ring-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit}
          className="custom-scrollbar flex-1 overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Title & Destination */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Package Title *
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="e.g. Cox's Bazar Beach Tour 3"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Destination *
              </label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  type="text"
                  placeholder="Cox's Bazar, Bangladesh"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
              </div>
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Price (৳) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    placeholder="12500"
                    min="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Max Capacity *
                </label>
                <div className="relative">
                  <Users className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    type="number"
                    placeholder="20"
                    min="1"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Description *
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the tour experience..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Cover Image *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="absolute inset-0 h-full w-full object-cover opacity-40"
                    />
                    <div className="z-10 flex cursor-pointer items-center gap-2 rounded-lg bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80">
                      <UploadCloud className="h-4 w-4" /> Change Image
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-2 h-8 w-8 text-indigo-500" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Click to select image
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <hr className="my-2 border-slate-100 sm:col-span-2 dark:border-slate-800" />

            {/* Dates Configuration */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Last Booking Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    value={lastBookingDay}
                    onChange={(e) => setLastBookingDay(e.target.value)}
                    type="date"
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Available Tour Dates *
                </label>
                <div className="flex gap-2">
                  <input
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    type="date"
                    className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDate}
                    disabled={!newDate}
                    className="cursor-pointer rounded-xl bg-slate-900 px-4 text-white transition-all hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-100 dark:focus:ring-offset-slate-900"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {availableDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {availableDates.map((date, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        {date}{" "}
                        <X
                          className="h-3 w-3 cursor-pointer transition-colors hover:text-indigo-900 dark:hover:text-indigo-100"
                          onClick={() =>
                            setAvailableDates(
                              availableDates.filter((_, i) => i !== idx)
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities Configuration */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Amenities *
              </label>
              <div className="flex gap-2">
                <input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddAmenity())
                  }
                  type="text"
                  placeholder="e.g. Hotel, Breakfast..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  disabled={!newAmenity.trim()}
                  className="cursor-pointer rounded-xl bg-slate-900 px-4 text-white transition-all hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-100 dark:focus:ring-offset-slate-900"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    >
                      {amenity}{" "}
                      <X
                        className="h-3 w-3 cursor-pointer transition-colors hover:text-emerald-900 dark:hover:text-emerald-100"
                        onClick={() =>
                          setAmenities(amenities.filter((_, i) => i !== idx))
                        }
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-2 border-slate-100 sm:col-span-2 dark:border-slate-800" />

            {/* Itinerary Configuration */}
            <div className="space-y-3 sm:col-span-2">
              <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Day-by-Day Itinerary *
              </label>
              <div className="flex gap-2">
                <span className="flex items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Day {itinerary.length + 1}
                </span>
                <input
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddItinerary())
                  }
                  type="text"
                  placeholder="e.g. Arrival and hotel check-in"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddItinerary}
                  disabled={!newActivity.trim()}
                  className="cursor-pointer rounded-xl bg-slate-900 px-4 text-white transition-all hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-100 dark:focus:ring-offset-slate-900"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {itinerary.length > 0 && (
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  {itinerary.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 border-b border-slate-200/50 pb-2 last:border-0 last:pb-0 dark:border-slate-700/50"
                    >
                      <div className="flex gap-3">
                        <span className="mt-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          Day {item.day}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {item.activity}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setItinerary(itinerary.filter((_, i) => i !== idx))
                        }
                        className="cursor-pointer text-slate-400 transition-colors hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-900"
          >
            {isLoading ? "Creating..." : "Publish Package"}
          </button>
        </div>
      </div>
    </div>
  )
}
