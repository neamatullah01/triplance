import { getAllReviewsAdmin } from "@/services/admin.service"
import { AdminReviewsClient } from "@/components/admin/AdminReviewsClient"

export default async function ReviewsPage() {
  const reviewsRes = await getAllReviewsAdmin()
  const reviews = reviewsRes?.data || []

  return <AdminReviewsClient initialReviews={reviews} />
}
