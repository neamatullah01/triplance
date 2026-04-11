"use client";

import { useState } from "react";
import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to /api/v1/auth/login
    console.log("Login attempt:", { email, password });
  };

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

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email address or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg transition-colors mt-2 cursor-pointer"
          >
            Log in
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