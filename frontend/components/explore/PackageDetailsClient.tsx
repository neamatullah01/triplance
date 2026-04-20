"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Star, CalendarDays, Users, CheckCircle2, 
  Map, Clock, ShieldCheck, Building2, ChevronDown, AlertCircle
} from "lucide-react";

export function PackageDetailsClient({ pkg }: { pkg: any }) {
  const [selectedDate, setSelectedDate] = useState(pkg.availableDates[0] || "");
  const [isBooking, setIsBooking] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  const handleBookNow = () => {
    setIsBooking(true);
    // Simulate API call
    setTimeout(() => {
      setIsBooking(false);
      alert("Booking initiated! Redirecting to payment...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* 1. Hero Image Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-slate-900">
        <img 
          src={pkg.images[0]} 
          alt={pkg.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 text-slate-200 mb-3"
            >
              <span className="flex items-center gap-1.5 font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                <MapPin className="h-4 w-4" />
                {pkg.destination}
              </span>
              <span className="flex items-center gap-1.5 font-medium bg-orange-500/90 backdrop-blur-md px-3 py-1 rounded-full text-sm text-white">
                <Star className="h-4 w-4 fill-white" />
                {pkg.rating > 0 ? pkg.rating : "New"}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md"
            >
              {pkg.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Details (Takes up 2/3 space) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-12"
          >
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Overview</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {pkg.description}
              </p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">What's Included</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pkg.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary Timeline */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Itinerary</h2>
                <Map className="h-6 w-6 text-indigo-500" />
              </div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-200 dark:before:via-indigo-800 before:to-transparent">
                {pkg.itinerary.map((item: any, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      {item.day}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 text-lg">Day {item.day}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-28 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800"
            >
              {/* Price Header */}
              <div className="mb-6">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Price</span>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                    {formatPrice(pkg.price)}
                  </h3>
                  <span className="text-slate-500 dark:text-slate-400 font-medium pb-1">/ person</span>
                </div>
              </div>

              {/* Selection Form */}
              <div className="space-y-4 mb-8">
                {/* Dates */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" /> Select Date
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 py-3.5 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                    >
                      {pkg.availableDates.map((date: string) => (
                        <option key={date} value={date}>{formatDate(date)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Last Booking Day */}
                {pkg.lastBookingDay && (() => {
                  const deadline = new Date(pkg.lastBookingDay);
                  const isExpired = deadline < new Date();
                  const deadlineStr = deadline.toLocaleDateString('en-US', { 
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                  });
                  return (
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                      isExpired 
                        ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' 
                        : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    }`}>
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isExpired 
                          ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' 
                          : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                      }`}>
                        {isExpired ? <AlertCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${
                          isExpired ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {isExpired ? 'Booking Closed' : 'Book By'}
                        </p>
                        <p className={`text-sm font-semibold ${
                          isExpired 
                            ? 'text-red-700 dark:text-red-300' 
                            : 'text-slate-900 dark:text-slate-100'
                        }`}>
                          {deadlineStr}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Capacity Info */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Group Size</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Max {pkg.maxCapacity} people</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button 
                onClick={handleBookNow}
                disabled={isBooking || (pkg.lastBookingDay && new Date(pkg.lastBookingDay) < new Date())}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isBooking ? (
                  <span className="flex items-center gap-2">Processing...</span>
                ) : (
                  <>Book This Package</>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Secure payment via Triplance
              </div>

              {/* Agency Info */}
              <hr className="my-6 border-slate-200 dark:border-slate-800" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5 font-medium">Organized by</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-indigo-500" />
                    {pkg.agency.name}
                  </p>
                </div>
                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                  Contact
                </button>
              </div>

            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
}