"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlaneTakeoff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "@/services/auth.service";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginUser(data);

      if (!result?.success) {
        setError("root", {
          message: result?.message || "Invalid email or password.",
        });
        return;
      }

      // Navigate to the dashboard or home on successful login
      router.push("/");
      router.refresh(); // Refresh state so server components receive new cookies
    } catch {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  const ErrorIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center gap-2 text-indigo-900 font-bold text-2xl mb-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <PlaneTakeoff className="h-8 w-8 text-indigo-600" />
          Triplance
        </Link>
      </div>

      <div className="w-full max-w-[400px]">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Log in to Triplance</h2>

        {/* Root / Server Error Banner */}
        {errors.root && (
          <div
            role="alert"
            className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3 mb-4"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.root.message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              className={`w-full px-4 py-3.5 bg-white border rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-slate-300 focus:ring-indigo-600"
              }`}
            />
            {errors.email && (
              <p
                id="login-email-error"
                role="alert"
                className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"
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
              aria-describedby={errors.password ? "login-password-error" : undefined}
              {...register("password")}
              className={`w-full px-4 py-3.5 bg-white border rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.password
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-slate-300 focus:ring-indigo-600"
              }`}
            />
            {errors.password && (
              <p
                id="login-password-error"
                role="alert"
                className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"
              >
                <ErrorIcon />
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="text-center mt-4 mb-6">
          <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
            Forgotten password?
          </Link>
        </div>

        <hr className="border-slate-200 mb-6" />

        <div className="flex justify-center mb-6">
          <Link href="/register" className="w-full">
            <button className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-lg transition-colors cursor-pointer">
              Create new account
            </button>
          </Link>
        </div>

        {/* Social Login Divider */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs font-semibold text-slate-400">Or continue with</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Social Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm cursor-pointer">
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}