import { SettingsClient } from "@/components/settings/SettingsClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | Triplance",
  description: "Manage your Triplance account preferences and settings.",
}

export default async function SettingsPage() {
  // TODO: Fetch user data from your database here later
  // const user = await getUser();

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 dark:bg-[#0B0F19]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your profile, preferences, and security for your journeys.
          </p>
        </div>

        {/* Render the interactive client component */}
        <SettingsClient />
      </div>
    </main>
  )
}
