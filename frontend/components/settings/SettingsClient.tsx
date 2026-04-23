"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Wallet,
  Save,
  ArrowLeft,
  Plane,
  HeartPulse,
  Lock,
} from "lucide-react"
import { toast } from "sonner"

const TABS = [
  { id: "preferences", label: "App Preferences", icon: Settings },
  { id: "travel-info", label: "Travel Information", icon: Plane },
  { id: "billing", label: "Payment & Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
]

export function SettingsClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("preferences")
  const [isLoading, setIsLoading] = useState(false)

  // Travel Data State
  const [travelData, setTravelData] = useState({
    emergencyContact: "Jane Doe",
    emergencyPhone: "+880 1711 000000",
    dietary: "Halal",
    documentType: "Passport",
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Settings saved successfully!")
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar / Mobile Menu Area */}
      <aside className="w-full shrink-0 lg:w-64">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>

        {/* 📱 MOBILE NAVIGATION (Dropdown) */}
        <div className="block lg:hidden">
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#111622] dark:text-white"
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
            {/* Custom Dropdown Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 💻 DESKTOP NAVIGATION (Sidebar) */}
        <nav className="hidden space-y-1 lg:block">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
                />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-[#111622]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* ----------------- PREFERENCES TAB ----------------- */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    App Preferences
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Customize how Triplance looks and feels.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <Wallet className="h-4 w-4 text-slate-400" /> Default
                      Currency
                    </label>
                    <select className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white">
                      <option>BDT (৳)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <Globe className="h-4 w-4 text-slate-400" /> Language
                    </label>
                    <select className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white">
                      <option>English (US)</option>
                      <option>Bengali</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TRAVEL INFO TAB ----------------- */}
            {activeTab === "travel-info" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Travel Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Securely store details to speed up your future bookings.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <HeartPulse className="h-4 w-4 text-slate-400" />{" "}
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      value={travelData.emergencyContact}
                      onChange={(e) =>
                        setTravelData({
                          ...travelData,
                          emergencyContact: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <HeartPulse className="h-4 w-4 text-slate-400" />{" "}
                      Emergency Phone
                    </label>
                    <input
                      type="text"
                      value={travelData.emergencyPhone}
                      onChange={(e) =>
                        setTravelData({
                          ...travelData,
                          emergencyPhone: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Dietary Requirements
                    </label>
                    <select
                      value={travelData.dietary}
                      onChange={(e) =>
                        setTravelData({
                          ...travelData,
                          dietary: e.target.value,
                        })
                      }
                      className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                    >
                      <option>None</option>
                      <option>Halal</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                      <option>Gluten-Free</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Primary ID Document
                    </label>
                    <select
                      value={travelData.documentType}
                      onChange={(e) =>
                        setTravelData({
                          ...travelData,
                          documentType: e.target.value,
                        })
                      }
                      className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                    >
                      <option>Passport</option>
                      <option>National ID (NID)</option>
                      <option>Driver's License</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- BILLING TAB ----------------- */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Payment Methods
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your cards and billing history securely via Stripe.
                  </p>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-14 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        VISA
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        •••• •••• •••• 4242
                      </p>
                      <p className="text-xs text-slate-500">Expires 12/30</p>
                    </div>
                  </div>
                  <button className="w-fit cursor-pointer text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400">
                    Remove
                  </button>
                </div>

                <button className="flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400">
                  + Add new payment method
                </button>
              </div>
            )}

            {/* ----------------- PRIVACY & SECURITY TAB ----------------- */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Privacy & Security
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Control who sees your content and manage account safety.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        Profile Visibility
                      </h4>
                      <p className="text-sm text-slate-500">
                        Allow other explorers to find you.
                      </p>
                    </div>
                    <select className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                      <option>Public</option>
                      <option>Connections Only</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                        <Lock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Change Password
                        </h4>
                        <p className="text-sm text-slate-500">
                          Update your account password.
                        </p>
                      </div>
                    </div>
                    <button className="w-fit cursor-pointer text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- SAVE BUTTON ----------------- */}
            {(activeTab === "preferences" || activeTab === "travel-info") && (
              <div className="mt-8 flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto dark:focus:ring-offset-slate-900"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
