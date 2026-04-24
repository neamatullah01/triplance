import { AgencyPostCard } from "@/components/agency/agency-dashboard/social/AgencyPostCard"
import { CreatePostForm } from "@/components/agency/agency-dashboard/social/CreatePostForm"
import { getMyPosts } from "@/services/post.service"

export default async function AgencySocialFeedPage() {
  // Fetch posts from your backend
  // Depending on your getMyPost implementation, you might need to pass page/limit params
  const response = await getMyPosts()
  const posts = response || []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Social Feed
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Share trip updates and promotions to the Triplance feed
        </p>
      </div>

      {/* Create Post Section */}
      <CreatePostForm />

      {/* Feed Section */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post: any) => <AgencyPostCard key={post.id} post={post} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No posts yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Create your first post above to engage with travelers!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
