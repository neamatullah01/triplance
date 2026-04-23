import { LeftSidebar } from "@/components/feed/LeftSidebar"
import { MainFeed } from "@/components/feed/MainFeed"
import { RightSidebar } from "@/components/feed/RightSidebar"
import { getUser } from "@/services/auth.service"
import Link from "next/link"
import { Building2, ArrowRight } from "lucide-react"

export default async function FeedPage() {
  const user = await getUser()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8 lg:pb-6">
      {/* 12-Column Grid Layout */}
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:col-span-3 lg:block">
          {/* ✅ FIX: Added fixed height and overflow-y-auto for independent scrolling */}
          <div className="custom-scrollbar sticky top-5 h-[calc(100vh-4rem)] overflow-y-auto pb-6">
            <LeftSidebar />
          </div>
        </div>

        {/* Main Content (Scrollable naturally by the browser) */}
        <div className="col-span-1 lg:col-span-6">
          <MainFeed />
        </div>

        {/* Right Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:col-span-3 lg:block">
          {/* ✅ FIX: Added fixed height and overflow-y-auto for independent scrolling */}
          <div className="custom-scrollbar sticky top-5 h-[calc(100vh-4rem)] overflow-y-auto pb-6">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
