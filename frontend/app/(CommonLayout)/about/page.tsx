import {
  PlaneTakeoff,
  Search,
  CalendarCheck,
  MapPin,
  Users,
  Globe,
  Star,
  Shield,
  Heart,
  Compass,
} from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Triplance",
  description:
    "Learn about Triplance — a full-stack travel social & booking platform connecting travelers with trusted agencies worldwide.",
}

const stats = [
  { value: "500+", label: "Destinations", icon: MapPin },
  { value: "10K+", label: "Happy Travelers", icon: Users },
  { value: "200+", label: "Trusted Agencies", icon: Shield },
  { value: "4.8", label: "Average Rating", icon: Star },
]

const steps = [
  {
    step: "01",
    title: "Discover",
    description:
      "Browse curated travel packages from verified agencies. Filter by destination, price, or travel style to find your perfect trip.",
    icon: Search,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    step: "02",
    title: "Book",
    description:
      "Select your dates, choose your group size, and book securely. Our integrated payment system makes checkout seamless.",
    icon: CalendarCheck,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    step: "03",
    title: "Travel & Share",
    description:
      "Experience your adventure, then share your journey on our social feed. Leave reviews to help fellow travelers.",
    icon: Globe,
    gradient: "from-amber-500 to-orange-500",
  },
]

const values = [
  {
    title: "Trust & Safety",
    description:
      "Every agency goes through our verification process. Your safety and satisfaction are our top priorities.",
    icon: Shield,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    title: "Community First",
    description:
      "Travel is better together. Our social feed connects you with like-minded explorers and inspiring stories.",
    icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Smart Discovery",
    description:
      "AI-powered recommendations help you find trips you'll love. Our platform learns what excites you and suggests accordingly.",
    icon: Compass,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-24 sm:py-32">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-purple-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <PlaneTakeoff className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white/90">
              About Triplance
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Travel Smarter.{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Connect Deeper.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-indigo-100 sm:text-xl">
            Triplance is a next-generation travel social and booking platform
            that bridges travelers with trusted agencies — making every journey
            unforgettable.
          </p>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────── */}
      <section className="relative -mt-12 z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
              >
                <Icon className="mb-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            How Triplance Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            From discovery to departure — here&apos;s how we make travel
            effortless.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.step}
                className="group relative rounded-2xl border border-slate-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
              >
                {/* Step number */}
                <span className="mb-4 block text-5xl font-black text-slate-100 dark:text-slate-800">
                  {step.step}
                </span>

                {/* Icon */}
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient} text-white shadow-md`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── Our Values ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 sm:py-28 dark:bg-slate-800/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              What We Believe In
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Every feature we build is guided by these core principles.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {values.map((val) => {
              const Icon = val.icon
              return (
                <div
                  key={val.title}
                  className="rounded-2xl border border-slate-100 bg-white p-8 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${val.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${val.color}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    {val.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {val.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
          Ready to Start Your Journey?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-lg text-slate-600 dark:text-slate-400">
          Join thousands of travelers who are already discovering amazing
          destinations through Triplance.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95"
          >
            <Compass className="h-5 w-5" />
            Explore Packages
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  )
}
