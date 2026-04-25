import { notFound } from "next/navigation"
import { getExplorerProfile } from "@/services/auth.service"
import { getUser } from "@/services/auth.service"
import { ExplorerProfileClient } from "@/components/explorers/ExplorerProfileClient"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const explorer = await getExplorerProfile(id)
  if (!explorer) return { title: "Explorer | Triplance" }
  return {
    title: `${explorer.name} | Triplance Explorer`,
    description: explorer.bio || `View ${explorer.name}'s profile on Triplance.`,
  }
}

export default async function ExplorerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [explorer, currentUser] = await Promise.all([
    getExplorerProfile(id),
    getUser(),
  ])

  if (!explorer) notFound()

  // Check if the current user is following this explorer
  const isFollowing = explorer.isFollowed ?? (explorer.followers?.some(
    (follower: any) => follower.followerId === currentUser?.id
  ) || false)

  return (
    <ExplorerProfileClient
      explorer={explorer}
      currentUserId={currentUser?.id ?? null}
      initialIsFollowing={isFollowing}
    />
  )
}
