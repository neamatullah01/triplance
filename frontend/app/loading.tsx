"use client"

import { motion } from "framer-motion"
import { LocationEditIcon, Plane } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Subtle Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <div className="relative flex items-center justify-center">
        {/* Outer Orbiting Ring with Airplane */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute h-48 w-48 rounded-full border-[1.5px] border-dashed border-indigo-300 dark:border-indigo-800/60"
        >
          {/* The Airplane sitting on the track */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-50 px-1 dark:bg-slate-950">
            <Plane
              className="h-6 w-6 rotate-90 text-indigo-600 dark:text-indigo-400"
              fill="currentColor"
            />
          </div>
        </motion.div>

        {/* Inner Reverse Spinning Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute h-32 w-32 rounded-full border-2 border-transparent border-b-indigo-500 border-l-indigo-500 opacity-60"
        />

        {/* Center Glowing Compass */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 shadow-inner shadow-indigo-200 dark:bg-indigo-900/40 dark:shadow-indigo-900/50"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <LocationEditIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
        </motion.div>
      </div>

      {/* Typography & Branding */}
      <div className="mt-12 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl font-black tracking-[0.3em] text-slate-900 dark:text-white"
        >
          TRIPLANCE
        </motion.h1>

        {/* Pulsing Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <span>Curating your next adventure</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0,
            }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.2,
            }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.4,
            }}
          >
            .
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
}
