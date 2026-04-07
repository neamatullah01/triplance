import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: "indigo" | "emerald" | "amber" | "rose" | "sky";
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    icon: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400",
    ring: "ring-indigo-200/50 dark:ring-indigo-800/30",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    icon: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-200/50 dark:ring-emerald-800/30",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    icon: "bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200/50 dark:ring-amber-800/30",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    icon: "bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400",
    ring: "ring-rose-200/50 dark:ring-rose-800/30",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    icon: "bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400",
    ring: "ring-sky-200/50 dark:ring-sky-800/30",
  },
};

export function StatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={`
        relative overflow-hidden
        p-5 rounded-2xl border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900
        shadow-sm hover:shadow-md transition-shadow duration-300
        ring-1 ${colors.ring}
      `}
    >
      {/* Decorative background glow */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 blur-2xl ${colors.bg}`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          <p
            className={`text-xs font-medium mt-1 ${
              changeType === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : changeType === "down"
                ? "text-red-500 dark:text-red-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {changeType === "up" && "↑ "}
            {changeType === "down" && "↓ "}
            {change}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
