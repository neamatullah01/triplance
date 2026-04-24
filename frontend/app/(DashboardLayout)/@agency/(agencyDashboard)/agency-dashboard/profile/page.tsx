import { getUser } from "@/services/auth.service";
import AgencyProfileForm from "@/components/agency/agency-dashboard/profile/AgencyProfileForm";
import { redirect } from "next/navigation";

export default async function AgencyProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <AgencyProfileForm user={user} />;
}
