import { Clock } from "lucide-react"
import { ElementType } from "react"

interface ActivityItem {
  icon: ElementType
  text: string
  time: string
  color: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Recent Activity
        </h3>
      </div>
      <div className="space-y-5 px-4 py-4 sm:px-6">
        {activities.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm leading-snug text-slate-700 dark:text-slate-300">
                  {item.text}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
