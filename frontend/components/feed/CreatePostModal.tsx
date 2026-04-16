"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Plus, X, MapPin, Tag, Building2, UploadCloud, Loader2, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createPost } from "@/services/post.service";

export function CreatePostModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    // Reset state after close animation
    setTimeout(() => {
      setContent("");
      setLocation("");
      setAgencyName("");
      setTags([]);
      setTagInput("");
      setImages([]);
      setPreviewUrls([]);
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== newFiles.length) {
      toast.error("Some files were rejected. Only images are allowed.");
    }
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error("Please add some content or an image to post.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Array to hold our final uploaded image URLs
      let uploadedImageUrls: string[] = [];

      // 2. Upload images to Cloudinary if there are any
      if (images.length > 0) {
        toast.info("Uploading images...");
        
        // Use Promise.all to upload multiple images at the same time
        const uploadPromises = images.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "triplance_preset"); // <-- Replace this
          
          // Replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/df9ixbksu/image/upload", 
            {
              method: "POST",
              body: formData,
            }
          );
          
          const data = await response.json();
          return data.secure_url; // This is the permanent link to the image
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
      }
      
      // 3. Prepare the final data payload
      const postData = {
        content,
        images: uploadedImageUrls, // Now we are sending URLs, not File objects!
        location,
        agencyName,
        tags
      };
      
      console.log("Submitting Post to database:", postData);
      
      // 4. Send this to your Next.js API route to save in NeonDB
      const result = await createPost(postData);

      if (result && result.success) {
        toast.success("Post created successfully!");
        handleClose();
        router.refresh(); // Refreshes server components (like Sidebar counts)
        window.dispatchEvent(new CustomEvent("refreshMainFeed")); // Dynamically refreshes the client feed
      } else {
         throw new Error(result?.message || "Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-medium rounded-2xl transition-all shadow-sm hover:shadow-md hover:cursor-pointer active:scale-95"
      >
        <Plus className="h-5 w-5" />
        Create Post
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full sm:max-w-2xl overflow-hidden z-10 flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create New Post</h2>
                <button 
                  onClick={handleClose}
                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                
                {/* Content Input */}
                <div>
                  <textarea
                    placeholder="What's on your mind? e.g. Just got back from Cox's Bazar! What a beautiful place..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>

                {/* Drag and Drop Image Upload */}
                <div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer text-center ${
                      isDragging 
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                        : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <ImagePlus className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>

                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer backdrop-blur-sm"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Add Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  
                  {/* Agency Name */}
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Agency Name (Optional)"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="relative mb-3">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Add tags (press Enter or comma)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  {/* Tag Chips */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold">
                          #{tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-indigo-900 dark:hover:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 rounded-full p-0.5 cursor-pointer transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-auto sticky bottom-0 z-20">
                <button 
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!content.trim() && images.length === 0)}
                  className="flex justify-center items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
