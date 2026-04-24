import { PostsTable } from "@/components/admin/posts/PostsTable";
import { getAllPostsAdmin } from "@/services/admin.service";

interface PageProps {
  searchParams: Promise<{ tab?: string; page?: string }> | { tab?: string; page?: string };
}

export default async function PostsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const queryTab = searchParams?.tab || "all";
  const page = parseInt(searchParams?.page || "1", 10);

  // Fetch all to find total reported posts count correctly
  const allPostsResponse = await getAllPostsAdmin("?limit=1000");
  const allPosts = allPostsResponse.data || [];

  const reportedCount = allPosts.filter((p: any) => p.isReported || p.reported).length;

  let query = `?limit=10&page=${page}`;
  if (queryTab === "reported") {
    query += "&isReported=true";
  }

  const listResponse = await getAllPostsAdmin(query);

  const posts = (listResponse.data || []).map((p: any) => ({
    id: p.id,
    author: p.author?.name || p.author?.agencyName || "Unknown",
    role: p.author?.role?.toLowerCase() || "traveler",
    content: p.content || "",
    likes: p._count?.likes || p.likes?.length || 0,
    comments: p._count?.comments || p.comments?.length || 0,
    reported: p.isReported || p.reported || false,
    date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  // Fallback local filter just in case the backend doesn't support the isReported query yet
  const finalPosts = queryTab === "reported" ? posts.filter((p: any) => p.reported) : posts;

  return <PostsTable initialPosts={finalPosts} currentTab={queryTab} reportedCount={reportedCount} meta={listResponse.meta} />;
}
