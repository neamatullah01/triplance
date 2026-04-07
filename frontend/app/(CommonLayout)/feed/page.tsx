import { LeftSidebar } from "@/components/feed/LeftSidebar";
import { MainFeed } from "@/components/feed/MainFeed";
import { RightSidebar } from "@/components/feed/RightSidebar";


export default function FeedPage() {
  return (
    <div className="w-full max-w-7xl mx-auto pt-6 pb-20 lg:pb-6 px-4 sm:px-6 lg:px-8">
      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Left Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-5">
            <LeftSidebar />
          </div>
        </div>

        {/* Main Content (Scrollable) */}
        <div className="col-span-1 lg:col-span-6">
          <MainFeed />
        </div>

        {/* Right Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-5">
            <RightSidebar />
          </div>
        </div>

      </div>
    </div>
  );
}