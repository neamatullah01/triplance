"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CreditCard } from "lucide-react"

export default function PaymentButton({ bookingId }: { bookingId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    toast.loading("Connecting to secure checkout...")

    try {
      // Call your backend proxy or backend directly
      const res = await fetch(
        `https://triplancebackend.vercel.app/api/v1/payments/initiate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        }
      )

      const responseData = await res.json()

      if (responseData.success && responseData.data.paymentUrl) {
        // Redirect traveler to Stripe
        window.location.href = responseData.data.paymentUrl
      } else {
        toast.error(responseData.message || "Failed to initiate payment")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
    >
      <CreditCard className="h-5 w-5" />
      {isLoading ? "Redirecting..." : "Pay Securely with Stripe"}
    </button>
  )
}
