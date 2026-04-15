import Link from "next/link";
import { CheckCircle2, Clock, MapPin, PlaneTakeoff, ShieldCheck } from "lucide-react";

export default function AgencyApprovalPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 text-center border border-slate-100">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-30 animate-pulse"></div>
            <div className="relative h-24 w-24 bg-white rounded-full flex items-center justify-center border-4 border-indigo-50 shadow-sm">
              <Clock className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Application Received!
        </h1>
        
        <p className="text-slate-600 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Thank you for registering your agency with Triplance. Our team is currently reviewing your details. This process helps us maintain quality and safety for our community.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-50 p-5 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-3" />
            <h3 className="font-bold text-slate-800 text-sm mb-1">1. Submitted</h3>
            <p className="text-xs text-slate-500">Your application was received successfully.</p>
          </div>
          <div className="bg-indigo-50/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center border border-indigo-100 ring-2 ring-indigo-500/20 shadow-sm shadow-indigo-100">
            <Clock className="h-8 w-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-indigo-900 text-sm mb-1">2. In Review</h3>
            <p className="text-xs text-indigo-600/80">Admin team is verifying your documents.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-100">
            <ShieldCheck className="h-8 w-8 text-slate-400 mb-3" />
            <h3 className="font-bold text-slate-800 text-sm mb-1">3. Approved</h3>
            <p className="text-xs text-slate-500">You will be notified once you go live.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <PlaneTakeoff className="h-4 w-4" />
              Return to Home
            </button>
          </Link>
          <Link href="/login">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 cursor-pointer active:scale-95">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
