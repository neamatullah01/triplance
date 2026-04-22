"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  PlaneTakeoff,
  Loader2,
  Eye,
  EyeOff,
  User,
  Building2,
  CheckCircle2,
  Info,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createUser } from "@/services/auth.service"

type Role = "TRAVELER" | "AGENCY"

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirm: string
  agencyName?: string
  website?: string
  bio?: string
}

export function SignupForm() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("TRAVELER")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>()

  const password = watch("password", "")
  const confirm = watch("confirm", "")

  const onSubmit = async (data: SignupFormValues) => {
    const toastId = toast.loading("Creating your account...")

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
        ...(role === "AGENCY" && {
          agencyName: data.agencyName,
          website: data.website,
          bio: data.bio,
        }),
      }

      const result = await createUser(payload)

      if (!result?.success) {
        const errorMsg =
          result?.message || "Registration failed. Please try again."
        setError("root", {
          message: errorMsg,
        })
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success("Account created successfully!", { id: toastId })

      // Redirect logic for signup
      if (role === "TRAVELER") {
        router.push("/")
      } else {
        // Agencies usually require approval first before hitting the dashboard
        router.push("/agency-approval")
      }

      router.refresh() // Refresh state so server components receive new cookies
    } catch (error) {
      const fallbackError = "Something went wrong during registration."
      setError("root", {
        message: fallbackError,
      })
      toast.error(fallbackError, { id: toastId })
    }
  }

  const ErrorIcon = () => (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )

  const tabVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-y-auto px-6 py-8 sm:px-12 lg:w-1/2">
      {/* Mobile Logo */}
      <div className="mb-8 flex items-center gap-2 self-start text-2xl font-bold text-indigo-900 lg:hidden">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
        >
          <PlaneTakeoff className="h-8 w-8 text-indigo-600" />
          Triplance
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-auto w-full max-w-[440px]"
      >
        {/* Header */}
        <h2 className="mb-1 text-2xl font-bold text-slate-900">
          Create your account
        </h2>
        <p className="mb-6 text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Log in
          </Link>
        </p>

        {/* Role Toggle */}
        <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setRole("TRAVELER")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
              role === "TRAVELER"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User className="h-4 w-4" />
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("AGENCY")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
              role === "AGENCY"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Travel Agency
          </button>
        </div>

        {/* Agency Approval Notice */}
        <AnimatePresence mode="wait">
          {role === "AGENCY" && (
            <motion.div
              key="agency-notice"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-5 overflow-hidden"
            >
              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Approval Required
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
                    Agency accounts require admin review before you can publish
                    packages. You'll be notified once approved.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Root / Server Error Banner */}
        {errors.root && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
          >
            <ErrorIcon />
            {errors.root.message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {/* Common: Name */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  {role === "AGENCY" ? "Your Full Name" : "Full Name"}
                </label>
                <input
                  type="text"
                  placeholder={
                    role === "AGENCY" ? "John Doe (Account Owner)" : "John Doe"
                  }
                  {...register("name", { required: "Full name is required" })}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:outline-none ${
                    errors.name
                      ? "border-rose-400 focus:ring-rose-400"
                      : "border-slate-300 focus:ring-indigo-600"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                    <ErrorIcon /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Agency Name (agency only) */}
              {role === "AGENCY" && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    placeholder="Sunrise Travels Ltd."
                    {...register("agencyName", {
                      required:
                        role === "AGENCY" ? "Agency name is required" : false,
                    })}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:outline-none ${
                      errors.agencyName
                        ? "border-rose-400 focus:ring-rose-400"
                        : "border-slate-300 focus:ring-indigo-600"
                    }`}
                  />
                  {errors.agencyName && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                      <ErrorIcon /> {errors.agencyName.message}
                    </p>
                  )}
                </div>
              )}

              {/* Common: Email */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder={
                    role === "AGENCY" ? "agency@example.com" : "you@example.com"
                  }
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:outline-none ${
                    errors.email
                      ? "border-rose-400 focus:ring-rose-400"
                      : "border-slate-300 focus:ring-indigo-600"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                    <ErrorIcon /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Agency Website */}
              {role === "AGENCY" && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Website{" "}
                    <span className="font-medium text-slate-400">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://sunrisetravels.com"
                    {...register("website")}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Agency Bio */}
              {role === "AGENCY" && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Agency Bio{" "}
                    <span className="font-medium text-slate-400">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    placeholder="Tell travelers about your agency and specialties..."
                    {...register("bio")}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className={`w-full rounded-xl border bg-white py-3 pr-12 pl-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:outline-none ${
                      errors.password
                        ? "border-rose-400 focus:ring-rose-400"
                        : "border-slate-300 focus:ring-indigo-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                    <ErrorIcon /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    {...register("confirm", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`w-full rounded-xl border bg-white py-3 pr-12 pl-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:outline-none ${
                      errors.confirm
                        ? "border-rose-400 focus:ring-rose-400"
                        : "border-slate-300 focus:ring-indigo-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Password match hint */}
                {confirm && (
                  <p
                    className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${confirm === password ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {confirm === password ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passwords match
                      </>
                    ) : (
                      <>
                        <ErrorIcon />{" "}
                        {errors.confirm?.message ?? "Passwords do not match"}
                      </>
                    )}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Terms */}
          <p className="pt-1 text-xs leading-relaxed text-slate-500">
            By continuing, you agree to Triplance's{" "}
            <Link
              href="/terms"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isSubmitting || (confirm.length > 0 && confirm !== password)
            }
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {isSubmitting
              ? "Creating Account..."
              : role === "AGENCY"
                ? "Submit Agency Application"
                : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs font-semibold text-slate-400">
            Or sign up with
          </span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          <span>from</span>
          <PlaneTakeoff className="h-3 w-3" />
          <span className="text-slate-600">Triplance</span>
        </div>
      </motion.div>
    </div>
  )
}
