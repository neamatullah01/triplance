"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { PlaneTakeoff, Star, Users, Globe } from "lucide-react";

const floatAnimate = { y: [0, -12, 0] };

const floatTransition = (delay: number) => ({
  duration: 5,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stats = [
  { label: "Happy Travelers", value: "10K+", icon: Users, color: "bg-indigo-100 text-indigo-600" },
  { label: "Destinations", value: "120+", icon: Globe, color: "bg-emerald-100 text-emerald-600" },
  { label: "Avg. Rating", value: "4.9★", icon: Star, color: "bg-amber-100 text-amber-600" },
];

export function SignupVisuals() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-100 min-h-screen">

      {/* Top Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-indigo-900 font-bold text-2xl z-10 w-fit hover:opacity-80 transition-opacity cursor-pointer"
      >
        <PlaneTakeoff className="h-8 w-8 text-indigo-600" />
        Triplance
      </Link>

      {/* ── Image Collage — top-right ── */}
      <div className="absolute top-[10%] right-0 w-[58%] h-[62%] pointer-events-none">

        {/* Main tall image */}
        <motion.div
          animate={floatAnimate}
          transition={floatTransition(0)}
          className="absolute right-[16%] top-0 w-[52%] h-[78%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10"
        >
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"
            alt="Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9
          </div>
        </motion.div>

        {/* Stats mini card */}
        <motion.div
          animate={floatAnimate}
          transition={floatTransition(1.5)}
          className="absolute left-0 top-[4%] w-[44%] bg-white p-3 rounded-2xl shadow-xl border-2 border-slate-100 z-30 flex flex-col gap-3"
        >
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none">{value}</p>
                <p className="text-[10px] text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom agency card */}
        <motion.div
          animate={floatAnimate}
          transition={floatTransition(1)}
          className="absolute left-[2%] bottom-[5%] w-[42%] h-[50%] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white z-20 flex flex-col"
        >
          <div className="p-2 pb-1 flex-none flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full">
              <Globe className="h-3 w-3" />
            </div>
            <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80"
            alt="Agency"
            className="w-full flex-1 object-cover"
          />
          <div className="p-3 flex-none space-y-2">
            <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
            <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
          </div>
        </motion.div>

        {/* Avatar bubble */}
        <motion.div
          animate={floatAnimate}
          transition={floatTransition(2)}
          className="absolute right-[14%] bottom-[4%] w-[16%] aspect-square rounded-full overflow-hidden shadow-xl border-4 border-white z-30"
        >
          <img
            src="https://us.123rf.com/450wm/engy14/engy142306/engy14230600167/206643105-young-man-with-backpack-taking-selfie-portrait-outside-smiling-happy-guy-enjoying-summer-holidays.jpg?ver=6"
            alt="Traveler"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating badge */}
        <motion.div
          animate={floatAnimate}
          transition={floatTransition(0.5)}
          className="absolute right-[2%] top-1/2 w-[12%] aspect-square bg-indigo-600 rounded-full shadow-lg border-4 border-white flex items-center justify-center z-20 cursor-pointer"
        >
          <PlaneTakeoff className="h-4 w-4 text-white" />
        </motion.div>
      </div>

      {/* ── Bottom Text ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-[6%] left-[8%] z-10 max-w-[45%]"
      >
        <h1 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">
          <motion.span variants={itemVariants} className="block">Join</motion.span>
          <motion.span variants={itemVariants} className="block">10,000+</motion.span>
          <motion.span variants={itemVariants} className="block text-indigo-600">travelers.</motion.span>
        </h1>
        <motion.p variants={itemVariants} className="mt-3 text-slate-500 font-medium text-sm leading-relaxed">
          Discover, book, and share travel experiences with the world's fastest-growing travel community.
        </motion.p>
      </motion.div>
    </div>
  );
}
