"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlaneTakeoff } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { loginUser } from "@/services/auth.service" // <-- IMPORT THE HELPER
import { getRedirectPathByRole } from "@/lib/role-redirect"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    const toastId = toast.loading("Signing in...")
    try {
      const result = await loginUser(data)

      if (!result?.success) {
        const errorMsg = result?.message || "Invalid email or password."
        setError("root", {
          message: errorMsg,
        })
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success("Successfully logged in!", { id: toastId })

      const userRole = result.data?.user?.role
      const redirectPath = await getRedirectPathByRole(userRole)

      router.push(redirectPath)
      router.refresh()
    } catch {
      const fallbackError = "Something went wrong. Please try again."
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

  return (
    <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-1/2">
      {/* Mobile Logo */}
      <div className="mb-10 flex items-center gap-2 text-2xl font-bold text-indigo-900 lg:hidden">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
        >
          <PlaneTakeoff className="h-8 w-8 text-indigo-600" />
          Triplance
        </Link>
      </div>

      <div className="w-full max-w-[400px]">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Log in to Triplance
        </h2>

        {/* Root / Server Error Banner */}
        {errors.root && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
          >
            <ErrorIcon />
            {errors.root.message}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Email */}
          <div>
            <input
              id="login-email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
              className={`w-full rounded-lg border bg-white px-4 py-3.5 text-slate-900 transition-all placeholder:text-slate-500 focus:border-transparent focus:ring-2 focus:outline-none ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-slate-300 focus:ring-indigo-600"
              }`}
            />
            {errors.email && (
              <p
                id="login-email-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-xs text-rose-500"
              >
                <ErrorIcon />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              id="login-password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              {...register("password")}
              className={`w-full rounded-lg border bg-white px-4 py-3.5 text-slate-900 transition-all placeholder:text-slate-500 focus:border-transparent focus:ring-2 focus:outline-none ${
                errors.password
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-slate-300 focus:ring-indigo-600"
              }`}
            />
            {errors.password && (
              <p
                id="login-password-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-xs text-rose-500"
              >
                <ErrorIcon />
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3.5 font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <svg
                className="h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-4 mb-6 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Forgotten password?
          </Link>
        </div>

        <hr className="mb-6 border-slate-200" />

        <div className="mb-6 flex justify-center">
          <Link href="/register" className="w-full">
            <button className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white py-3 font-bold text-slate-900 transition-colors hover:bg-slate-50">
              Create new account
            </button>
          </Link>
        </div>

        {/* Social Login Divider */}
        <div className="my-6 flex items-center gap-4">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs font-semibold text-slate-400">
            Or continue with
          </span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Social Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
            <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  )
}
