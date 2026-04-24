"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Shield, Ban, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { banUser } from "@/services/admin.service";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  bookings: number;
}

interface UsersTableProps {
  initialUsers: User[];
  currentTab: string;
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin:    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    traveler: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    agency:   "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[role] || ""}`}>{role}</span>;
}

function StatusDot({ status }: { status: string }) {
  const color = status === "active" ? "bg-emerald-500" : status === "banned" ? "bg-red-500" : "bg-amber-500";
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="capitalize text-slate-700 dark:text-slate-300">{status}</span>
    </span>
  );
}

export function UsersTable({ initialUsers, currentTab }: UsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const handleTabChange = (f: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", f);
    router.push(`${pathname}?${params.toString()}`);
  }

  const filtered = initialUsers.filter((u) => {
    let matchSearch = true;
    if (search) {
      matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                    u.email.toLowerCase().includes(search.toLowerCase());
    }
    return matchSearch;
  });

  const executeToggleBan = async (id: string | number) => {
    setLoadingId(id);
    try {
      const res = await banUser(id.toString());
      if (res.success) {
        toast.success("User status updated successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update user status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleBan = (id: string | number, currentStatus: string) => {
    const action = currentStatus === "banned" ? "unban" : "ban";
    toast(`Are you sure you want to ${action} this user?`, {
      action: {
        label: "Confirm",
        onClick: () => executeToggleBan(id),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all platform users and their access</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{initialUsers.length} total users</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "travelers", "agencies", "banned"].map((f) => (
            <button key={f} onClick={() => handleTabChange(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${currentTab === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 sm:px-6 py-3">User</th>
                <th className="px-4 sm:px-6 py-3">Role</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Joined</th>
                <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Bookings</th>
                <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 shrink-0 uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5"><RoleBadge role={user.role} /></td>
                  <td className="px-4 sm:px-6 py-3.5"><StatusDot status={user.status} /></td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden md:table-cell">{user.joined}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium hidden sm:table-cell">{user.bookings}</td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {user.status === "banned" ? (
                        <button 
                          onClick={() => handleToggleBan(user.id, user.status)}
                          disabled={loadingId === user.id}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors disabled:opacity-50" 
                          title="Unban"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleBan(user.id, user.status)}
                          disabled={loadingId === user.id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50" 
                          title="Ban"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" title="More">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
