
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  admin,
  agency, 
}: Readonly<{
  admin: React.ReactNode;
  agency: React.ReactNode;
}>) {
  // 1. Fetch user session
  // const user = data?.user;
  // const role = user?.role?.toUpperCase();
  let role = "ADMIN";
  // 2. Unauthenticated users get kicked to login
  // if (!user) {
  //   redirect("/login");
  // }

  // 3. Serve ONLY the Admin slot if they are an admin
  if (role === "ADMIN") {
    return <>{admin}</>;
  }

  // 4. Serve ONLY the Provider slot if they are a provider
  if (role === "AGENCY") {
    return <>{agency}</>;
  }

  // 5. Normal customers shouldn't be here, send them to the homepage
  redirect("/");
}
