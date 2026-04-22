import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FD] p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="mb-2 text-2xl font-black text-slate-900">
          Payment Successful!
        </h1>
        <p className="mb-8 leading-relaxed text-slate-500">
          Your booking is confirmed. The agency has been notified and you are
          ready for your trip.
        </p>
        <Link
          href="/"
          className="block w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white transition-colors hover:bg-slate-800"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
