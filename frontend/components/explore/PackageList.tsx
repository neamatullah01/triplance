"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { MapPin, CalendarDays, Star, Building2, ArrowRight } from "lucide-react";

// Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function PackageList({ packages }: { packages: any[] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNextDate = (dates: string[]) => {
    if (!dates || dates.length === 0) return "Check availability";
    return new Date(dates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {packages.map((pkg) => (
        <motion.div key={pkg.id} variants={cardVariants}>
          <Link href={`/explore/${pkg.id}`} className="block group">
            <div className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300">
              
              {/* Left: Image Box */}
              <div className="w-full sm:w-72 md:w-80 h-56 sm:h-auto relative overflow-hidden shrink-0">
                <img 
                  src={pkg.images[0]} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                  {pkg.rating > 0 ? pkg.rating : "New"}
                </div>
              </div>

              {/* Right: Content Box */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {pkg.title}
                    </h3>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                        {formatPrice(pkg.price)}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Per Person</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {pkg.destination}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-4 w-4 text-emerald-500" />
                      <span>Next: {formatNextDate(pkg.availableDates)}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Building2 className="h-4 w-4 text-indigo-400" />
                      <span>By {pkg.agency.name}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                    View Details <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}