import { Metadata } from "next";
import Link from "next/link";
import { PlaneTakeoff, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Triplance",
  description: "Read the Triplance Terms of Service to understand your rights and responsibilities when using our travel booking platform.",
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "platform", title: "2. About the Platform" },
  { id: "accounts", title: "3. User Accounts & Roles" },
  { id: "traveler", title: "4. Traveler Obligations" },
  { id: "agency", title: "5. Agency Obligations" },
  { id: "bookings", title: "6. Bookings & Payments" },
  { id: "reviews", title: "7. Reviews & Content" },
  { id: "prohibited", title: "8. Prohibited Conduct" },
  { id: "termination", title: "9. Termination & Bans" },
  { id: "liability", title: "10. Limitation of Liability" },
  { id: "changes", title: "11. Changes to Terms" },
  { id: "contact", title: "12. Contact Us" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-900 font-bold text-xl hover:opacity-80 transition-opacity">
            <PlaneTakeoff className="h-6 w-6 text-indigo-600" />
            Triplance
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors">Log In</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">

        {/* Sticky Sidebar TOC */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">On this page</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-slate-600 hover:text-indigo-600 hover:translate-x-1 transition-all py-1 font-medium"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-3xl">

          {/* Hero */}
          <div className="mb-10 pb-8 border-b border-slate-100">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <PlaneTakeoff className="h-3.5 w-3.5" /> Legal
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Terms of Service</h1>
            <p className="text-slate-500 font-medium">
              Last updated: <span className="text-slate-700 font-semibold">April 12, 2026</span>
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Please read these Terms of Service carefully before using the Triplance platform. By accessing or using Triplance, you agree to be bound by these terms.
            </p>
          </div>

          <div className="space-y-12 text-slate-700 leading-relaxed">

            {/* 1 */}
            <section id="acceptance">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">1</span>
                Acceptance of Terms
              </h2>
              <p>
                By registering an account or otherwise using Triplance (the "Platform"), you confirm that you are at least 18 years old and that you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the Platform.
              </p>
            </section>

            {/* 2 */}
            <section id="platform">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">2</span>
                About the Platform
              </h2>
              <p>
                Triplance is a full-stack travel social and booking platform that connects <strong className="text-slate-900">Travelers</strong> with <strong className="text-slate-900">Travel Agencies</strong>. Travelers can discover and book travel packages, share travel stories, follow other users, and leave reviews. Agencies can publish and manage packages, share promotional content, and interact with the community.
              </p>
            </section>

            {/* 3 */}
            <section id="accounts">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">3</span>
                User Accounts & Roles
              </h2>
              <p className="mb-4">Triplance supports three account roles:</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {[
                  { role: "Traveler", desc: "Can browse packages, make bookings, write reviews, create posts, and follow others.", color: "border-indigo-200 bg-indigo-50" },
                  { role: "Agency", desc: "Can publish and manage travel packages, create posts, and respond to the community. Requires admin approval.", color: "border-emerald-200 bg-emerald-50" },
                  { role: "Admin", desc: "Manages platform integrity — approves agencies, moderates content, resolves disputes.", color: "border-amber-200 bg-amber-50" },
                ].map(({ role, desc, color }) => (
                  <div key={role} className={`rounded-xl border p-4 ${color}`}>
                    <p className="font-bold text-slate-900 mb-1 text-sm">{role}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <p>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Notify us immediately if you suspect unauthorized access.</p>
            </section>

            {/* 4 */}
            <section id="traveler">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">4</span>
                Traveler Obligations
              </h2>
              <ul className="space-y-2 list-none">
                {[
                  "Provide accurate personal information during registration.",
                  "Only submit reviews for packages where your booking status is Completed — one review per booking.",
                  "Respect agencies and fellow travelers in all interactions on the platform.",
                  "Comply with the cancellation and refund policies stated for each package.",
                  "Not attempt to book a package you have no intention of traveling on.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 5 */}
            <section id="agency">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">5</span>
                Agency Obligations
              </h2>
              <p className="mb-3">
                Agency accounts must be approved by a Triplance administrator before packages can be published. By registering as an agency, you agree to:
              </p>
              <ul className="space-y-2 list-none">
                {[
                  "Provide truthful, accurate, and up-to-date information about your agency and all travel packages.",
                  "Honor all confirmed bookings where payment has been received.",
                  "Manage slot availability accurately — overbooking is strictly prohibited.",
                  "Respond to traveler disputes and refund requests in a timely manner.",
                  "Not publish packages for destinations under active travel advisories without appropriate warnings.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 6 */}
            <section id="bookings">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">6</span>
                Bookings & Payments
              </h2>
              <p className="mb-3">
                When a traveler creates a booking, the total price is <strong className="text-slate-900">locked at the time of booking</strong> and does not change. Booking statuses follow this lifecycle:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: "Pending", color: "bg-amber-100 text-amber-800" },
                  { label: "Confirmed", color: "bg-emerald-100 text-emerald-800" },
                  { label: "Cancelled", color: "bg-rose-100 text-rose-800" },
                  { label: "Completed", color: "bg-indigo-100 text-indigo-800" },
                ].map(({ label, color }) => (
                  <span key={label} className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>{label}</span>
                ))}
              </div>
              <p className="mb-3">Payment must be completed before a booking moves to <strong className="text-slate-900">Confirmed</strong>. Payments are processed via Stripe or SSLCommerz. Triplance does not store your full card details.</p>
              <p>When a booking is cancelled, the reserved slot is restored to the package's available capacity. Refund eligibility is determined by the agency's published cancellation policy.</p>
            </section>

            {/* 7 */}
            <section id="reviews">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">7</span>
                Reviews & Content
              </h2>
              <p className="mb-3">
                Travelers may submit one review per completed booking. Reviews must be honest, based on personal experience, and must not contain offensive language, false claims, or personally identifying information of others.
              </p>
              <p>
                By posting any content on Triplance (posts, comments, reviews, or images), you grant Triplance a non-exclusive, royalty-free license to display that content on the Platform. You retain ownership of your content. Triplance administrators may remove content that violates these Terms.
              </p>
            </section>

            {/* 8 */}
            <section id="prohibited">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">8</span>
                Prohibited Conduct
              </h2>
              <p className="mb-3">You must not:</p>
              <ul className="space-y-2 list-none">
                {[
                  "Publish fraudulent packages or misrepresent travel services.",
                  "Submit fake reviews or manipulate agency ratings.",
                  "Harass, threaten, or abuse other users.",
                  "Attempt to reverse-engineer, scrape, or attack the Platform.",
                  "Use a banned account or create multiple accounts to circumvent bans.",
                  "Engage in money laundering or fraudulent payment activity.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 9 */}
            <section id="termination">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">9</span>
                Termination & Bans
              </h2>
              <p>
                Triplance administrators reserve the right to ban or suspend any user — traveler or agency — who violates these Terms, at their sole discretion. Banned users cannot log in or perform any actions on the Platform. If you believe a ban was made in error, contact our support team.
              </p>
            </section>

            {/* 10 */}
            <section id="liability">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">10</span>
                Limitation of Liability
              </h2>
              <p className="mb-3">
                Triplance is a marketplace that connects travelers and agencies. We are not liable for the quality, safety, or legality of any travel package or agency service. We do not guarantee uninterrupted access to the Platform.
              </p>
              <p>
                To the maximum extent permitted by law, Triplance's total liability for any claim arising from these Terms shall not exceed the amount you paid to Triplance (not to an agency) in the 6 months preceding the claim.
              </p>
            </section>

            {/* 11 */}
            <section id="changes">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">11</span>
                Changes to Terms
              </h2>
              <p>
                We may update these Terms from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of the Platform after changes constitutes your acceptance of the revised Terms.
              </p>
            </section>

            {/* 12 */}
            <section id="contact">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center">12</span>
                Contact Us
              </h2>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 mb-4">If you have questions about these Terms, please reach out:</p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-slate-900">Email:</span> <a href="mailto:legal@triplance.com" className="text-indigo-600 hover:underline">legal@triplance.com</a></p>
                  <p><span className="font-semibold text-slate-900">Platform:</span> <Link href="/" className="text-indigo-600 hover:underline">triplance.com</Link></p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/privacy" className="text-sm font-semibold text-indigo-600 hover:underline">
              Read our Privacy Policy →
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Triplance
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
