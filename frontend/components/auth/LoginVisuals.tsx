"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlaneTakeoff, Heart, MapPin, CalendarDays } from "lucide-react";

export function LoginVisuals() {
  const floatAnimation = (delay: number) => ({
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: delay,
    },
  });

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative overflow-hidden flex-col justify-between p-12">
      {/* Top Logo — clickable link to home */}
      <Link
        href="/"
        className="flex items-center gap-2 text-indigo-900 font-bold text-2xl z-10 w-fit hover:opacity-80 transition-opacity cursor-pointer"
      >
        <PlaneTakeoff className="h-8 w-8 text-indigo-600" />
        Triplance
      </Link>

      {/* Dynamic Image Collage — top-right, percentage-based so it scales with panel */}
      <div className="absolute top-[10%] right-0 w-[58%] h-[65%] pointer-events-none">

        {/* Main Center Image */}
        <motion.div
          animate={floatAnimation(0)}
          className="absolute right-[16%] top-0 w-[52%] h-[78%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10"
        >
          <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=80" alt="Travel Friends" className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
            16:45
          </div>
        </motion.div>

        {/* Mini Booking Card */}
        <motion.div
          animate={floatAnimation(1.5)}
          className="absolute left-0 top-[4%] w-[44%] bg-white p-3 rounded-2xl shadow-xl border-2 border-slate-100 z-30 flex flex-col gap-2"
        >
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">St Martin's Island</p>
              <p className="text-[10px] text-slate-500 font-medium">4 Days / 3 Nights</p>
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-black text-indigo-600">৳4,999</span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">Available</span>
          </div>
        </motion.div>

        {/* Bottom Left Image Card */}
        <motion.div
          animate={floatAnimation(1)}
          className="absolute left-[2%] bottom-[5%] w-[42%] h-[52%] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white z-20 flex flex-col"
        >
          <div className="p-2 pb-1 flex-none flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full">
              <MapPin className="h-3 w-3" />
            </div>
            <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
          </div>
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80" alt="Paris" className="w-full flex-1 object-cover" />
          <div className="p-3 flex-none space-y-2">
            <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
            <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
          </div>
        </motion.div>

        {/* Avatar Bubble */}
        <motion.div
          animate={floatAnimation(2)}
          className="absolute right-[14%] bottom-[4%] w-[16%] aspect-square rounded-full overflow-hidden shadow-xl border-4 border-white z-30"
        >
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80" alt="Traveler" className="w-full h-full object-cover" />
        </motion.div>

        {/* Floating Heart Icon */}
        <motion.div
          animate={floatAnimation(0.5)}
          className="absolute right-[2%] top-1/2 w-[12%] aspect-square bg-rose-500 rounded-full shadow-lg border-4 border-white flex items-center justify-center z-20 cursor-pointer"
        >
          <Heart className="h-4 w-4 text-white" fill="currentColor" />
        </motion.div>
      </div>

      {/* Bottom Text — percentage-based position, always stays in left 45% */}
      <div className="absolute bottom-[6%] left-[8%] z-10 max-w-[45%]">
        <h1 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">
          Explore <br /> the <br /> destinations <br />
          <span className="text-indigo-600">you love.</span>
        </h1>
      </div>
    </div>
  );
}