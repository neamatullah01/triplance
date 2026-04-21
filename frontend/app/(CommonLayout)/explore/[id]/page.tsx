import { notFound } from "next/navigation"
import { PackageDetailsClient } from "@/components/explore/PackageDetailsClient"
import { getPackageById } from "@/services/package.service"

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getPackageById(id)
  const pkg = result?.data
  if (!pkg) return { title: "Package Not Found | Triplance" }
  return {
    title: `${pkg.title} | Triplance`,
    description: pkg.description,
  }
}

// Server Component
export default async function SinglePackagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getPackageById(id)
  const pkg = result?.data

  if (!pkg) {
    notFound()
  }

  return <PackageDetailsClient pkg={pkg} />
}
