"use client";

import { useState } from "react";
import { Camera, Send, Heart, MessageCircle, Trash2 } from "lucide-react";

const posts = [
  { id: "PST-1", content: "Just wrapped up an amazing group tour in the Sundarbans! 🐅🍃", likes: 124, comments: 18, time: "2 hours ago" },
  { id: "PST-2", content: "Cox's Bazar May bookings are open — only 5 spots left! 🌊🏖️", likes: 89, comments: 11, time: "1 day ago" },
];

export default function AgencySocialPage() {
  const [postContent, setPostContent] = useState("");
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Social Feed</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Share trip updates and promotions to the Triplance feed</p>
      </div>

      {/* Create Post */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Create a Post</h3>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Share a trip update, photo, or promotional offer..."
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all"
        />
        <div className="mt-4 flex items-center justify-between gap-2">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors">
            <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Add Photos</span>
          </button>
          <button
            disabled={!postContent.trim()}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Post <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">TA</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Test Agency</p>
                  <p className="text-xs text-slate-500">{post.time}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-4">{post.content}</p>
            <div className="flex items-center gap-4 sm:gap-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-rose-500 transition-colors">
                <Heart className="h-4 w-4" /> {post.likes} Likes
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors">
                <MessageCircle className="h-4 w-4" /> {post.comments} Comments
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
