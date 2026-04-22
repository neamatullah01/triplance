"use client";

import { useState } from "react";
import { Save, Camera, MapPin, Phone, Mail, Globe, Star } from "lucide-react";

export default function AgencyProfilePage() {
  const [agencyName, setAgencyName] = useState("Test Agency");
  const [bio, setBio] = useState("We are a premier travel agency based in Dhaka, specializing in immersive Bangladesh tours and eco-tourism adventures.");
  const [phone, setPhone] = useState("+880 1700-000000");
  const [email, setEmail] = useState("contact@testagency.com");
  const [website, setWebsite] = useState("https://testagency.com");
  const [location, setLocation] = useState("Dhaka, Bangladesh");

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Agency Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your public-facing profile visible to travellers</p>
      </div>

      {/* Profile Card + Form — stacked on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg">
              TA
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center justify-center hover:text-indigo-600 transition-colors shadow-sm">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{agencyName}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" /> {location}
            </p>
          </div>
          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
            {[{ label: "Packages", value: "12" }, { label: "Bookings", value: "3,624" }, { label: "Rating", value: "4.8" }].map((s) => (
              <div key={s.label}>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-amber-200 text-amber-200"}`} />
            ))}
            <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400">4.8 / 5</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Profile</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Bio / Description</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-none px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
            />
          </div>

          {/* Contact Grid — 1 col on mobile, 2 col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Phone",    value: phone,    setter: setPhone,    icon: Phone,  type: "tel"   },
              { label: "Email",    value: email,    setter: setEmail,    icon: Mail,   type: "email" },
              { label: "Website",  value: website,  setter: setWebsite,  icon: Globe,  type: "url"   },
              { label: "Location", value: location, setter: setLocation, icon: MapPin, type: "text"  },
            ].map(({ label, value, setter, icon: Icon, type }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-600/25">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
