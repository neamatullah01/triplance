"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Home, ArrowLeft, Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 dark:bg-slate-950">
      {/* Background Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Floating Map Pin */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: [0, -15, 0], opacity: 1 }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8 },
          }}
          className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 shadow-xl shadow-indigo-500/20 dark:bg-indigo-900/50"
        >
          <MapPin className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          {/* Pulsing ring underneath the pin */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 h-6 w-12 rounded-[100%] bg-indigo-300/50 blur-sm dark:bg-indigo-600/50"
          />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="text-[8rem] leading-none font-black tracking-tighter text-slate-900 md:text-[12rem] dark:text-white"
        >
          4<span className="text-indigo-600 dark:text-indigo-500">0</span>4
        </motion.h1>

        {/* Subtitles */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 flex flex-col items-center space-y-3"
        >
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-200">
            Looks like you've wandered off the map.
          </h2>
          <p className="max-w-md text-slate-500 dark:text-slate-400">
            The destination you are looking for doesn't exist, has been moved,
            or is currently undiscovered territory.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => window.history.back()}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all ring-inset hover:bg-slate-50 sm:w-auto dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>

          <Link href="/" className="w-full sm:w-auto">
            <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-95">
              <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
              Return to Base
            </button>
          </Link>
        </motion.div>

        {/* Decorative Compass watermark */}
        <Compass className="absolute -right-20 -bottom-20 -z-10 h-96 w-96 text-slate-200 opacity-50 dark:text-slate-800 dark:opacity-30" />
      </div>
    </div>
  )
}
