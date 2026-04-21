"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import { updateUserProfile } from "@/services/auth.service"; // Adjust path if needed
import { getCroppedImg } from "@/lib/cropImage";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdate: (updatedData: any) => void;
}

const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = (error) => reject(error);
  });
};

export function EditProfileModal({ isOpen, onClose, user, onProfileUpdate }: EditProfileModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  
  // Base64 strings to send to backend
  const [profileBase64, setProfileBase64] = useState<string | null>(null);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);

  // Previews
  const [profilePreview, setProfilePreview] = useState<string>(user?.profileImage || "");
  const [coverPreview, setCoverPreview] = useState<string>(user?.coverImage || "");

  // Cropping States
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64Str = await convertBase64(file);

    if (type === "cover") {
      // Open the cropper for cover images
      setImageToCrop(base64Str);
      setIsCropping(true);
    } else {
      // Handle profile image instantly (no cropping)
      setProfileBase64(base64Str);
      setProfilePreview(base64Str);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      // Get the new cropped Base64 string
      const croppedImageBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setCoverBase64(croppedImageBase64);
      setCoverPreview(croppedImageBase64);
      setIsCropping(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    setIsLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        bio: bio.trim(),
      };

      if (profileBase64) payload.profileImage = profileBase64;
      if (coverBase64) payload.coverImage = coverBase64;

      const res = await updateUserProfile(user.id, payload);

      if (res?.success) {
        toast.success("Profile updated successfully!", { id: toastId });
        onProfileUpdate({
          name,
          bio,
          profileImage: res.data?.profileImage || profilePreview,
          coverImage: res.data?.coverImage || coverPreview,
        });
        onClose();
      } else {
        toast.error(res?.message || "Failed to update profile", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[50%] left-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-4"
          >
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative">
              
              {/* --- CROPPER OVERLAY --- */}
              {isCropping && imageToCrop ? (
                <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col">
                  <div className="relative flex-1">
                    <Cropper
                      image={imageToCrop}
                      crop={crop}
                      zoom={zoom}
                      aspect={3 / 1} // Aspect ratio for cover (e.g., 3:1 width:height)
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className="p-4 bg-slate-900 flex justify-between gap-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsCropping(false)}
                      className="px-4 py-2 rounded-xl text-slate-300 font-bold hover:bg-slate-800"
                    >
                      Cancel Crop
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCrop}
                      className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2 hover:bg-indigo-700"
                    >
                      <Check className="w-5 h-5" /> Confirm
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Edit Profile</h2>
                <button 
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="overflow-y-auto custom-scrollbar">
                <form id="edit-profile-form" onSubmit={handleSubmit} className="flex flex-col">
                  
                  {/* Images Section */}
                  <div className="relative mb-14">
                    {/* Cover */}
                    <div 
                      className="h-32 sm:h-40 w-full bg-slate-200 dark:bg-slate-800 relative group cursor-pointer"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-80" />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white mb-2">
                          <Camera className="h-6 w-6" />
                        </div>
                        <span className="text-white text-sm font-bold shadow-black drop-shadow-md">Change Cover</span>
                      </div>
                      <input 
                        type="file" accept="image/*" ref={coverInputRef} 
                        onChange={(e) => handleFileChange(e, "cover")} className="hidden" 
                      />
                    </div>

                    {/* Profile */}
                    <div className="absolute -bottom-10 left-6">
                      <div 
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-[#0f172a] bg-slate-100 dark:bg-slate-800 relative group cursor-pointer overflow-hidden shadow-sm"
                        onClick={() => profileInputRef.current?.click()}
                      >
                        {profilePreview ? (
                          <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-indigo-500 font-bold text-3xl">
                            {name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                        <input 
                          type="file" accept="image/*" ref={profileInputRef} 
                          onChange={(e) => handleFileChange(e, "profile")} className="hidden" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Inputs */}
                  <div className="px-6 pb-6 space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
                      <textarea
                        value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                <button
                  type="button" onClick={onClose} disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit" form="edit-profile-form" disabled={isLoading || !name.trim()}
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px] flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}