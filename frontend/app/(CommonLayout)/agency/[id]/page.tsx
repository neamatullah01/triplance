import { notFound } from "next/navigation";
import { AgencyProfileClient } from "@/components/agency/AgencyProfileClient";
import { getAgencyById } from "@/services/agency.service";
import { getUser } from "@/services/auth.service";

// 1. Generate SEO Metadata dynamically based on the agency data
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getAgencyById(resolvedParams.id);
  const agency = res?.data;

  return {
    title: `${agency?.agencyName || agency?.name || "Agency Profile"} | Triplance`,
    description: agency?.bio || "View this agency's profile on Triplance.",
  };
}

// 2. THIS IS THE DEFAULT EXPORT COMPONENT NEXT.JS IS LOOKING FOR
export default async function SingleAgencyPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  
  // Fetch the Agency Data from your backend service
  const res = await getAgencyById(resolvedParams.id);
  const agency = res?.data;

  // If no agency is found, trigger the Next.js 404 page
  if (!agency) {
    return notFound();
  }

  // Fetch the logged-in user to see if they follow this agency
  const loggedInUser = await getUser();
  
  // Check if the current user is following this agency
  const isFollowing = agency.isFollowed ?? (agency.followers?.some(
    (follower: any) => follower.followerId === loggedInUser?.id
  ) || false);

  return (
    <AgencyProfileClient 
      agency={agency} 
      initialIsFollowing={isFollowing} 
    />
  );
}