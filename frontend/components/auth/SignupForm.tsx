"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlaneTakeoff,
  Loader2,
  Eye,
  EyeOff,
  User,
  Building2,
  CheckCircle2,
  Info,
} from "lucide-react";

type Role = "traveler" | "agency";

export function SignupForm() {
  const [role, setRole] = useState<Role>("traveler");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Traveler fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Agency extra fields
  const [agencyName, setAgencyName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: POST /api/v1/auth/register with { name, email, password, role }
    setTimeout(() => {
      setIsLoading(false);
      console.log("Register:", { role, name, email });
    }, 1500);
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center relative min-h-screen overflow-y-auto py-8 px-6 sm:px-12">

      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center gap-2 text-indigo-900 font-bold text-2xl mb-8 self-start">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <PlaneTakeoff className="h-8 w-8 text-indigo-600" />
          Triplance
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] my-auto"
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
        <p className="text-slate-500 mb-6 font-medium text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>

        {/* Role Toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole("traveler")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              role === "traveler"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User className="h-4 w-4" />
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("agency")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              role === "agency"
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
          {role === "agency" && (
            <motion.div
              key="agency-notice"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-5"
            >
              <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Approval Required</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Agency accounts require admin review before you can publish packages. You'll be notified once approved.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {role === "agency" ? "Your Full Name" : "Full Name"}
                </label>
                <input
                  type="text"
                  placeholder={role === "agency" ? "John Doe (Account Owner)" : "John Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                />
              </div>

              {/* Agency Name (agency only) */}
              {role === "agency" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Agency Name</label>
                  <input
                    type="text"
                    placeholder="Sunrise Travels Ltd."
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                  />
                </div>
              )}

              {/* Common: Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder={role === "agency" ? "agency@example.com" : "you@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                />
              </div>

              {/* Agency Website */}
              {role === "agency" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Website <span className="text-slate-400 font-medium">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://sunrisetravels.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                  />
                </div>
              )}

              {/* Agency Bio */}
              {role === "agency" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Agency Bio <span className="text-slate-400 font-medium">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Tell travelers about your agency and specialties..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm resize-none"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirm ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password match hint */}
                {confirm && (
                  <p className={`text-xs mt-1.5 flex items-center gap-1 font-medium ${confirm === password ? "text-emerald-600" : "text-rose-500"}`}>
                    {confirm === password ? (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> Passwords match</>
                    ) : (
                      "Passwords do not match"
                    )}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Terms */}
          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            By continuing, you agree to Triplance's{" "}
            <Link href="/terms" className="text-indigo-600 font-semibold hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</Link>.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || (confirm !== password && confirm.length > 0)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              role === "agency" ? "Submit Agency Application" : "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-5">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs font-semibold text-slate-400">Or sign up with</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm cursor-pointer">
            <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-8">
          <span>from</span>
          <PlaneTakeoff className="h-3 w-3" />
          <span className="text-slate-600">Triplance</span>
        </div>
      </motion.div>
    </div>
  );
}
