"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, ExternalLink, MapPin, Mail, Ban, UserCheck } from "lucide-react";
import { approveAgency, rejectAgency, banUser } from "@/services/admin.service";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Agency {
  id: string | number;
  name: string;
  email: string;
  location: string;
  verified: boolean;
  rating: number;
  packages: number;
  submitted: string;
  isBanned?: boolean;
}

interface AgenciesGridProps {
  initialAgencies: Agency[];
  currentTab: string;
}

export function AgenciesGrid({ initialAgencies, currentTab }: AgenciesGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const handleTabChange = (f: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", f);
    router.push(`${pathname}?${params.toString()}`);
  };

  const filtered = initialAgencies.filter((a) => {
    let matchSearch = true;
    if (search) {
      matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                    a.email.toLowerCase().includes(search.toLowerCase());
    }
    return matchSearch;
  });

  const handleAction = async (action: string, id: string | number) => {
    setLoadingId(id);
    try {
      let res;
      if (action === "approve") res = await approveAgency(id.toString());
      else if (action === "reject") res = await rejectAgency(id.toString());
      else if (action === "ban" || action === "unban") res = await banUser(id.toString());

      if (res?.success) {
        const actionPastTense = action === "ban" ? "banned" : action === "unban" ? "unbanned" : action + "d";
        toast.success(`Agency ${actionPastTense} successfully`);
        router.refresh();
      } else {
        toast.error(res?.message || `Failed to ${action} agency`);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const confirmAction = (action: string, id: string | number) => {
    toast(`Are you sure you want to ${action} this agency?`, {
      action: {
        label: "Confirm",
        onClick: () => handleAction(action, id),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agency Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Approve, manage, and monitor travel agencies
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {["all", "verified", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => handleTabChange(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                currentTab === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
          />
        </div>
      </div>

      {/* Agency Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            {currentTab === "pending" ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            ) : (
              <Search className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {currentTab === "pending" 
              ? "All caught up!" 
              : "No agencies found"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {currentTab === "pending"
              ? "There are currently no travel agencies waiting for approval. Great job!"
              : search 
                ? `No results match your search for "${search}". Try adjusting your keywords.`
                : "There are no agencies to display in this category right now."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((agency) => (
            <div
              key={agency.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border ${agency.isBanned ? 'border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10' : 'border-slate-200 dark:border-slate-800'} shadow-sm p-5 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg uppercase">
                    {agency.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[150px]">{agency.name}</h3>
                      {agency.verified && !agency.isBanned && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="h-3 w-3 shrink-0" /> {agency.location}
                    </p>
                  </div>
                </div>
                {!agency.verified ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    Pending
                  </span>
                ) : agency.isBanned ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 flex items-center gap-1">
                    <Ban className="h-3 w-3" /> Banned
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" /> {agency.email}
              </div>

              {agency.verified ? (
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{agency.rating.toFixed(1)}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Rating</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{agency.packages}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Packages</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 italic">
                  Submitted on {agency.submitted}
                </p>
              )}

              <div className="flex items-center gap-2">
                {agency.verified ? (
                  <>
                    <button className="flex-1 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" /> View Profile
                    </button>
                    <button 
                      onClick={() => confirmAction(agency.isBanned ? "unban" : "ban", agency.id)}
                      disabled={loadingId === agency.id}
                      className="py-2 px-3 text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {agency.isBanned ? <UserCheck className="h-4 w-4" /> : "Ban"}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => confirmAction("approve", agency.id)}
                      disabled={loadingId === agency.id}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingId === agency.id ? "Processing..." : "Approve"}
                    </button>
                    <button 
                      onClick={() => confirmAction("reject", agency.id)}
                      disabled={loadingId === agency.id}
                      className="flex-1 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
