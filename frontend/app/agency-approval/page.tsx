import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  MapPin,
  PlaneTakeoff,
  ShieldCheck,
} from "lucide-react"

export default function AgencyApprovalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 sm:p-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-12">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-30 blur"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-50 bg-white shadow-sm">
              <Clock className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Application Received!
        </h1>

        <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-slate-600">
          Thank you for registering your agency with Triplance. Our team is
          currently reviewing your details. This process helps us maintain
          quality and safety for our community.
        </p>

        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
            <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-500" />
            <h3 className="mb-1 text-sm font-bold text-slate-800">
              1. Submitted
            </h3>
            <p className="text-xs text-slate-500">
              Your application was received successfully.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 text-center shadow-sm ring-2 shadow-indigo-100 ring-indigo-500/20">
            <Clock className="mb-3 h-8 w-8 text-indigo-600" />
            <h3 className="mb-1 text-sm font-bold text-indigo-900">
              2. In Review
            </h3>
            <p className="text-xs text-indigo-600/80">
              Admin team is verifying your documents.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
            <ShieldCheck className="mb-3 h-8 w-8 text-slate-400" />
            <h3 className="mb-1 text-sm font-bold text-slate-800">
              3. Approved
            </h3>
            <p className="text-xs text-slate-500">
              You will be notified once you go live.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:scale-95 sm:w-auto">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
