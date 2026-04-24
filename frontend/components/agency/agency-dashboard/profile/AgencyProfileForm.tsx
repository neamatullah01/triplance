"use client";

import { useState, useRef } from "react";
import { Save, Camera, MapPin, Phone, Mail, Globe, Star, Loader2 } from "lucide-react";
import { updateUserProfile } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AgencyProfileFormProps {
  user: any;
}

const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = (error) => reject(error);
  });
};

export default function AgencyProfileForm({ user }: AgencyProfileFormProps) {
  const router = useRouter();
  
  const [agencyName, setAgencyName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [location, setLocation] = useState(user?.location || "");
  
  const [profileBase64, setProfileBase64] = useState<string | null>(null);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  
  const [profilePreview, setProfilePreview] = useState<string>(user?.profileImage || "");
  const [coverPreview, setCoverPreview] = useState<string>(user?.coverImage || "");

  const [isUpdating, setIsUpdating] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64Str = await convertBase64(file);

    if (type === "cover") {
      setCoverBase64(base64Str);
      setCoverPreview(base64Str);
    } else {
      setProfileBase64(base64Str);
      setProfilePreview(base64Str);
    }
  };

  const handleUpdate = async () => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    const toastId = toast.loading("Updating profile...");
    
    try {
      const payload: any = {
        name: agencyName,
        bio,
        phone,
        email,
        website,
        location
      };

      if (profileBase64) payload.profileImage = profileBase64;
      if (coverBase64) payload.coverImage = coverBase64;
      
      const res = await updateUserProfile(user.id, payload);
      
      if (res?.success) {
        toast.success("Profile updated successfully", { id: toastId });
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update profile", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Agency Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your public-facing profile visible to travellers</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Avatar & Summary */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-0 text-center shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          
          {/* Cover Image */}
          <div 
            className="group relative h-32 w-full cursor-pointer bg-slate-100 dark:bg-slate-800"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="mb-1 h-6 w-6 text-white" />
              <span className="text-xs font-bold text-white drop-shadow-md">Change Cover</span>
            </div>
            <input type="file" accept="image/*" ref={coverInputRef} onChange={(e) => handleFileChange(e, "cover")} className="hidden" />
          </div>

          <div className="relative -mt-12">
            <div 
              className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-indigo-600 text-2xl font-bold text-white shadow-md sm:h-24 sm:w-24 sm:text-3xl dark:border-slate-900"
              onClick={() => profileInputRef.current?.click()}
            >
              {profilePreview ? (
                <img src={profilePreview} alt={agencyName} className="h-full w-full object-cover" />
              ) : (
                agencyName ? agencyName.substring(0, 2).toUpperCase() : "TA"
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <input type="file" accept="image/*" ref={profileInputRef} onChange={(e) => handleFileChange(e, "profile")} className="hidden" />
          </div>

          <div className="px-6 pb-6 w-full flex flex-col items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">{agencyName || "Agency Name"}</h2>
              <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="h-3 w-3" /> {location || "No location added"}
              </p>
            </div>
            <div className="grid w-full grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-4 dark:border-slate-800">
              {[
                { label: "Packages", value: user?._count?.packages || 0 }, 
                { label: "Bookings", value: user?._count?.bookings || 0 }, 
                { label: "Rating", value: user?.rating?.toFixed(1) || "0.0" }
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">{s.value}</p>
                  <p className="text-[10px] tracking-wider text-slate-500 uppercase">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(user?.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-amber-200 text-amber-200"}`} />
              ))}
              <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {user?.rating?.toFixed(1) || "0.0"} / 5
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Profile</h3>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:ring-indigo-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Bio / Description</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:ring-indigo-900"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Phone",    value: phone,    setter: setPhone,    icon: Phone,  type: "tel"   },
              { label: "Email",    value: email,    setter: setEmail,    icon: Mail,   type: "email", readOnly: true },
              { label: "Website",  value: website,  setter: setWebsite,  icon: Globe,  type: "url"   },
              { label: "Location", value: location, setter: setLocation, icon: MapPin, type: "text"  },
            ].map(({ label, value, setter, icon: Icon, type, readOnly }) => (
              <div key={label}>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">{label}</label>
                <div className="relative">
                  <Icon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => !readOnly && setter(e.target.value)}
                    readOnly={readOnly}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:ring-indigo-900 ${
                      readOnly ? "cursor-not-allowed opacity-60" : ""
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:px-6"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
