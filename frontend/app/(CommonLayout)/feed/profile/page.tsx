import { redirect } from "next/navigation";
import { getUser } from "@/services/auth.service";
import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata = {
  title: "My Profile | Triplance",
  description: "Manage your Triplance profile, view your posts, and track your journeys.",
};

export default async function ProfilePage() {
  // Fetch the currently logged-in user
  const user = await getUser();

  // If no user is found, redirect them to the login page
  if (!user) {
    redirect("/login");
  }

  // Assuming your getUser() might not fetch follower counts by default, 
  // ensure we map safe defaults so the UI doesn't break
  const safeUser = {
    ...user,
    followersCount: user._count?.followers || 0,
    followingCount: user._count?.following || 0,
  };

  return (
    <>
      <ProfileClient user={safeUser} />
    </>
  );
}