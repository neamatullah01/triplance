"use client"

import { useState, FormEvent } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  PlaneTakeoff,
  ChevronDown,
  MessageCircle,
  Clock,
  Globe,
} from "lucide-react"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@triplance.com",
    href: "mailto:support@triplance.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1234-567890",
    href: "tel:+8801234567890",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Dhaka, Bangladesh",
    href: "#",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Sun – Thu, 9AM – 6PM BST",
    href: "#",
  },
]

const faqs = [
  {
    question: "How do I book a travel package?",
    answer:
      "Browse our Explore page, select a package you love, choose your dates and group size, then complete the secure checkout. You'll receive a confirmation email with all the details.",
  },
  {
    question: "Are the travel agencies verified?",
    answer:
      "Yes! Every agency on Triplance goes through a strict verification process by our admin team before they can list any packages. We prioritize your safety and trust.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Cancellation policies vary by package. Generally, you can cancel before the trip starts. Check the specific package details for the cancellation policy, or contact our support team.",
  },
  {
    question: "How does the social feed work?",
    answer:
      "After your trips, you can share travel stories, photos, and tips on the social feed. Follow other travelers and agencies to see their content. Like and comment to engage with the community!",
  },
  {
    question: "How do I become a travel agency on Triplance?",
    answer:
      "Register as an Agency through our signup page. After submission, our admin team will review your application. Once approved, you can start creating and listing travel packages.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. We use Stripe for payment processing, which is PCI DSS Level 1 certified — the highest level of security in the payments industry. Your card details are never stored on our servers.",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.")
      return
    }
    setIsSubmitting(true)

    // Simulate sending
    await new Promise((r) => setTimeout(r, 1200))

    toast.success("Message sent successfully! We'll get back to you soon. ✈️")
    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-purple-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <MessageCircle className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white/90">
              Get in Touch
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            We&apos;d Love to{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-lg text-indigo-100">
            Have a question, feedback, or need help planning your next
            adventure? Reach out — our team is here for you.
          </p>
        </div>
      </section>

      {/* ─── Contact Form + Info ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="What's this about?"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell us how we can help..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:opacity-60 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Contact Info
            </h2>
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                      <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
                        {info.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {info.value}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Quick Note */}
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 dark:border-indigo-900/30 dark:from-indigo-900/10 dark:to-purple-900/10">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Need quick help?
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Try our{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  AI Travel Assistant
                </span>{" "}
                — click the ✨ button at the bottom-right of your screen for
                instant answers about packages, bookings, and more!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-16 sm:py-24 dark:bg-slate-800/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Quick answers to common questions about Triplance.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
