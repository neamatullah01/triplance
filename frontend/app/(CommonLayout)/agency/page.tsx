import { AgencyListClient } from "@/components/agency/AgencyListClient";
import { allAgencyForUser } from "@/services/agency.service";

export const metadata = {
  title: "Agencies | Triplance",
  description: "Find trusted travel agencies and tour operators.",
};

export default async function AgencyPage({
  searchParams,
}: {
  // 1. Update the type to be a Promise
  searchParams: Promise<{ q?: string; page?: string }>; 
}) {
  // 2. Await the searchParams before accessing its properties
  const resolvedParams = await searchParams;
  
  const searchQuery = resolvedParams.q || "";
  const currentPage = Number(resolvedParams.page) || 1;
  
  // Fetch paginated and searched agencies directly from backend
  const limit = 20;
  const response = await allAgencyForUser(searchQuery, currentPage, limit);
  const fetchedAgencies = response?.data || [];
  const fetchedMeta = response?.meta || { page: currentPage, limit, total: 0 };

  // Map to the format expected by AgencyListClient
  const mappedAgencies = fetchedAgencies.map((agency: any) => ({
    id: agency.id,
    name: agency.name || "Unknown",
    bio: agency.bio || "No summary provided.",
    profileImage: agency.profileImage || null,
    coverImage: null,
    rating: agency.rating || 0,
    followersCount: agency._count?.followers || 0,
    isVerified: agency.isVerified || false,
    email: agency.email,
    isFollowed: agency.isFollowed || false,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Pass data down to the interactive client component */}
      <AgencyListClient 
        agencies={mappedAgencies} 
        meta={fetchedMeta} 
        initialSearch={searchQuery} 
      />
    </div>
  );
}