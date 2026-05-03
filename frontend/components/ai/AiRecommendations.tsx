"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Compass, Loader2 } from "lucide-react";
import Link from "next/link";

interface Recommendation {
  title: string;
  description: string;
  type: string;
  emoji: string;
}

const typeColors: Record<string, string> = {
  Adventure:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Relaxation:
    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Culture:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Family:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Nature:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Romance:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const cardGradients = [
  "from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5",
  "from-sky-500/10 to-cyan-500/10 dark:from-sky-500/5 dark:to-cyan-500/5",
  "from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5",
  "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5",
];

export function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/ai/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: "" }),
        });
        const data = await res.json();
        if (data.recommendations && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        }
      } catch (err) {
        console.error("Failed to fetch AI recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Picks for You
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Powered by Triplance AI
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="mb-3 h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="mb-2 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mb-1 h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ✨ AI Picks for You
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Personalized suggestions powered by Triplance AI
            </p>
          </div>
        </div>
        <Link
          href="/explore"
          className="hidden items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 sm:flex dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <Compass className="h-4 w-4" />
          Explore All
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Link
              href={`/explore?destination=${encodeURIComponent(rec.title.split(" ")[0])}`}
              className={`group block h-full rounded-2xl border border-slate-100 bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:hover:shadow-black/20 ${cardGradients[index % cardGradients.length]}`}
            >
              {/* Emoji */}
              <div className="mb-3 text-3xl">{rec.emoji}</div>

              {/* Title */}
              <h3 className="mb-1.5 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {rec.title}
              </h3>

              {/* Description */}
              <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {rec.description}
              </p>

              {/* Type Badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${typeColors[rec.type] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}
              >
                <MapPin className="h-3 w-3" />
                {rec.type}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
