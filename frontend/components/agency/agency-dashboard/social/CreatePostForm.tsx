"use client"

import { useState, useRef } from "react"
import { Send, ImagePlus, MapPin, X, Loader2, Tag } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createPost } from "@/services/post.service"

export function CreatePostForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [showLocation, setShowLocation] = useState(false)

  // Tags State
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)

  // Images State
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── Handlers ───
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.type.startsWith("image/"))

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...validFiles])
      setPreviewUrls((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const newTag = tagInput.trim().replace(/^#/, "")
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      return toast.error("Please add some content or an image to post.")
    }

    setIsSubmitting(true)

    try {
      let uploadedImageUrls: string[] = []

      // 1. Upload images to Cloudinary
      if (images.length > 0) {
        toast.info("Uploading images...")

        const uploadPromises = images.map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("upload_preset", "triplance_preset") // Replace with your preset

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/df9ixbksu/image/upload", // Replace with your cloud name
            { method: "POST", body: formData }
          )

          const data = await response.json()
          return data.secure_url
        })

        uploadedImageUrls = await Promise.all(uploadPromises)
      }

      // 2. Prepare Payload
      const postData = {
        content,
        images: uploadedImageUrls,
        location: showLocation && location.trim() ? location : undefined,
        tags: tags.length > 0 ? tags : undefined,
      }

      // 3. Send to API
      const result = await createPost(postData)

      if (result && result.success) {
        toast.success("Post published successfully!")

        // Reset form
        setContent("")
        setLocation("")
        setShowLocation(false)
        setTags([])
        setTagInput("")
        setShowTags(false)
        setImages([])
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        setPreviewUrls([])

        router.refresh()
        window.dispatchEvent(new CustomEvent("refreshMainFeed"))
      } else {
        throw new Error(result?.message || "Failed to publish post")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
        Create a Post
      </h2>

      {/* Input Area */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/50">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a trip update, stunning photo, or promotional offer..."
          className="w-full resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
          rows={3}
        />

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previewUrls.map((preview, idx) => (
              <div
                key={idx}
                className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-rose-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Location Input Toggle */}
        {showLocation && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
            <MapPin className="h-4 w-4 text-indigo-500" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (e.g., Sundarbans, Bangladesh)"
              className="flex-1 bg-transparent text-xs outline-none dark:text-white"
              autoFocus
            />
            <button
              onClick={() => {
                setShowLocation(false)
                setLocation("")
              }}
              className="text-slate-400 hover:text-rose-500"
            >
              <X className="h-4 w-4 cursor-pointer" />
            </button>
          </div>
        )}

        {/* Tags Input Toggle */}
        {showTags && (
          <div className="mt-3 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-500" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags (press Enter)"
                className="flex-1 bg-transparent text-xs outline-none dark:text-white"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowTags(false)
                  setTags([])
                  setTagInput("")
                }}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <ImagePlus className="h-4 w-4" /> Photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />

          <button
            onClick={() => setShowLocation(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <MapPin className="h-4 w-4" /> Location
          </button>

          <button
            onClick={() => setShowTags(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <Tag className="h-4 w-4" /> Tags
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!content.trim() && images.length === 0)}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto dark:focus:ring-offset-slate-900"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" /> Post
            </>
          )}
        </button>
      </div>
    </div>
  )
}
