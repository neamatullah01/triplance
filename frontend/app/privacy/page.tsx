import { Metadata } from "next";
import Link from "next/link";
import { PlaneTakeoff, ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Triplance",
  description: "Learn how Triplance collects, uses, and protects your personal information.",
};

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "collection", title: "2. Data We Collect" },
  { id: "usage", title: "3. How We Use Your Data" },
  { id: "storage", title: "4. Data Storage & Security" },
  { id: "sharing", title: "5. Data Sharing" },
  { id: "cookies", title: "6. Cookies & Tokens" },
  { id: "rights", title: "7. Your Rights" },
  { id: "retention", title: "8. Data Retention" },
  { id: "children", title: "9. Children's Privacy" },
  { id: "changes", title: "10. Policy Changes" },
  { id: "contact", title: "11. Contact Us" },
];

export default function PrivacyPage() {
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
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
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
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Shield className="h-3.5 w-3.5" /> Privacy
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 font-medium">
              Last updated: <span className="text-slate-700 font-semibold">April 12, 2026</span>
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Your privacy matters to us. This Privacy Policy explains what data Triplance collects, how it is used, and your rights over that data. Triplance is built on Next.js, Node.js, and PostgreSQL.
            </p>
          </div>

          <div className="space-y-12 text-slate-700 leading-relaxed">

            {/* 1 */}
            <section id="overview">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">1</span>
                Overview
              </h2>
              <p>
                Triplance ("we", "us", "our") operates the Triplance platform — a travel social and booking marketplace. By creating an account, you acknowledge that your data will be processed according to this policy. We are committed to handling your data transparently and securely.
              </p>
            </section>

            {/* 2 */}
            <section id="collection">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">2</span>
                Data We Collect
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Account Data",
                    items: ["Full name", "Email address", "Hashed password (bcrypt)", "Role (traveler / agency / admin)", "Profile image (optional)", "Bio (optional)"],
                  },
                  {
                    title: "Agency-Specific Data",
                    items: ["Agency name", "Website URL", "Package listings (title, description, price, images, destination, itinerary, amenities, capacity, dates)"],
                  },
                  {
                    title: "Booking & Payment Data",
                    items: ["Selected travel dates and number of travelers", "Booking status", "Total price locked at booking time", "Payment status and transaction ID (from Stripe / SSLCommerz)", "We do not store full card numbers"],
                  },
                  {
                    title: "Social & Interaction Data",
                    items: ["Posts (captions, images, tags)", "Comments", "Likes", "Follow relationships", "Reviews (rating, text)"],
                  },
                  {
                    title: "Technical Data",
                    items: ["IP address (server logs)", "JWT access and refresh token metadata", "Device/browser type (from request headers)"],
                  },
                ].map(({ title, items }) => (
                  <div key={title} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <p className="font-bold text-slate-900 text-sm mb-2">{title}</p>
                    <ul className="space-y-1">
                      {items.map((item) => (
                        <li key={item} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 3 */}
            <section id="usage">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">3</span>
                How We Use Your Data
              </h2>
              <ul className="space-y-2">
                {[
                  "Create and authenticate your account using JWT access and refresh tokens.",
                  "Process and manage travel bookings and payments.",
                  "Display your profile, posts, and reviews to other users.",
                  "Calculate agency average ratings from submitted reviews.",
                  "Enable follow/follower relationships and personalized feeds.",
                  "Allow administrators to approve agency accounts and moderate content.",
                  "Send transactional emails (booking confirmations, approval notifications).",
                  "Analyze platform usage to improve features and performance.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm list-none">
                    <span className="mt-1 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 4 */}
            <section id="storage">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">4</span>
                Data Storage & Security
              </h2>
              <p className="mb-3">
                Your data is stored in a <strong className="text-slate-900">PostgreSQL</strong> database managed via <strong className="text-slate-900">Prisma ORM</strong>. Passwords are hashed using <strong className="text-slate-900">bcryptjs</strong> with a salt round of 12 and are never stored in plain text.
              </p>
              <p className="mb-3">
                Media files (profile images, package images) are stored in <strong className="text-slate-900">Cloudinary</strong> or <strong className="text-slate-900">AWS S3</strong>. All environment secrets (JWT keys, API keys, database credentials) are stored in server-side environment variables and are never exposed to the client.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Note:</strong> While we implement industry-standard security practices, no system is 100% secure. Please use a strong, unique password for your Triplance account.
              </div>
            </section>

            {/* 5 */}
            <section id="sharing">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">5</span>
                Data Sharing
              </h2>
              <p className="mb-3">We do not sell your personal data. We share data only in the following limited cases:</p>
              <div className="space-y-3">
                {[
                  { party: "Payment Gateways", desc: "Stripe or SSLCommerz receive booking payment details to process transactions securely. We transmit only the minimum necessary data." },
                  { party: "Cloud Storage", desc: "Cloudinary or AWS S3 stores media files you upload. These providers have their own security policies." },
                  { party: "Agencies", desc: "When you book a package, the relevant agency receives your name and booking details to facilitate the trip." },
                  { party: "Legal Obligations", desc: "We may disclose information if required by law, court order, or to protect the safety and rights of our users." },
                ].map(({ party, desc }) => (
                  <div key={party} className="flex gap-3 text-sm">
                    <span className="font-bold text-slate-900 w-36 flex-shrink-0">{party}</span>
                    <span className="text-slate-600">{desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6 */}
            <section id="cookies">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">6</span>
                Cookies & Tokens
              </h2>
              <p className="mb-3">
                Triplance uses <strong className="text-slate-900">HTTP-only cookies</strong> to store your JWT access and refresh tokens after login. HTTP-only cookies are not accessible via JavaScript, which protects against XSS attacks.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "Access Token", detail: "Short-lived (1 day). Used to authenticate API requests.", color: "bg-indigo-50 border-indigo-200" },
                  { name: "Refresh Token", detail: "Longer-lived (7 days). Used to silently renew your access token.", color: "bg-slate-50 border-slate-200" },
                ].map(({ name, detail, color }) => (
                  <div key={name} className={`rounded-xl border p-4 ${color}`}>
                    <p className="font-bold text-slate-900 text-sm mb-1">{name}</p>
                    <p className="text-xs text-slate-600">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 7 */}
            <section id="rights">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">7</span>
                Your Rights
              </h2>
              <p className="mb-3">You have the following rights regarding your data:</p>
              <ul className="space-y-2">
                {[
                  { right: "Access", desc: "Request a copy of the personal data we hold about you." },
                  { right: "Correction", desc: "Update your name, email, bio, or profile image at any time from your profile settings." },
                  { right: "Deletion", desc: "Request deletion of your account and associated data. Contact us to initiate this." },
                  { right: "Portability", desc: "Request your data in a structured, machine-readable format." },
                  { right: "Objection", desc: "Object to specific data processing activities where applicable." },
                ].map(({ right, desc }) => (
                  <li key={right} className="flex items-start gap-3 text-sm list-none">
                    <span className="font-bold text-indigo-700 w-24 flex-shrink-0 mt-0.5">{right}</span>
                    <span className="text-slate-600">{desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 8 */}
            <section id="retention">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">8</span>
                Data Retention
              </h2>
              <p>
                We retain your account data for as long as your account is active. Booking and payment records are retained for a minimum of 5 years to comply with financial regulations. When you delete your account, personal data is anonymized or removed, though aggregate analytics may be retained indefinitely.
              </p>
            </section>

            {/* 9 */}
            <section id="children">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">9</span>
                Children's Privacy
              </h2>
              <p>
                Triplance is not directed at individuals under 18 years of age. We do not knowingly collect personal data from anyone under 18. If we become aware that a minor has registered, we will promptly delete their account.
              </p>
            </section>

            {/* 10 */}
            <section id="changes">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">10</span>
                Policy Changes
              </h2>
              <p>
                We may revise this Privacy Policy periodically. We will update the "Last updated" date and, for significant changes, notify users via email or an in-platform banner. Continued use of Triplance after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* 11 */}
            <section id="contact">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-black flex items-center justify-center">11</span>
                Contact Us
              </h2>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 mb-4">For any privacy-related questions or data requests, contact us:</p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-slate-900">Privacy Email:</span> <a href="mailto:privacy@triplance.com" className="text-indigo-600 hover:underline">privacy@triplance.com</a></p>
                  <p><span className="font-semibold text-slate-900">General:</span> <a href="mailto:hello@triplance.com" className="text-indigo-600 hover:underline">hello@triplance.com</a></p>
                  <p><span className="font-semibold text-slate-900">Platform:</span> <Link href="/" className="text-indigo-600 hover:underline">triplance.com</Link></p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/terms" className="text-sm font-semibold text-indigo-600 hover:underline">
              Read our Terms of Service →
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
