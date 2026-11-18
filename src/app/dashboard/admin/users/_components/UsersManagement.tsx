"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Search,
} from "lucide-react";
import { updateUserRoleByAdmin } from "@/lib/actions/jobs";

// Shape of a user object from Better-Auth
export interface UserItem {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string | Date;
  banned?: boolean | null;
}

// Formats date into "Nov 04, 2026"
function formatDate(dateInput?: string | Date): string {
  if (!dateInput) return "Nov 04, 2026";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Nov 04, 2026";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

// Capitalizes role name (e.g. "seeker" -> "Seeker")
function capitalize(str?: string): string {
  if (!str) return "Seeker";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

interface UsersManagementProps {
  initialUsers: UserItem[];
}

export function UsersManagement({ initialUsers }: UsersManagementProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Handle changing user role
  const handleRoleChange = async (userId: string, newRole: string) => {
    // 1. Update UI state immediately
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );

    const result = await updateUserRoleByAdmin(userId,newRole);
    if(result.modifiedCount > 0){
      toast.success(`Role updated to ${capitalize(newRole)}`);
    }else{
      toast.error("Failed to update role");
    }
  };

  // Filter users based on search input and role filter
  const filteredUsers = users.filter((u) => {
    const matchesEmail =
      !searchQuery ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      roleFilter === "all" ||
      (u.role && u.role.toLowerCase() === roleFilter.toLowerCase()) ||
      (!u.role && roleFilter === "seeker");

    return matchesEmail && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* 1. Top Header Bar: Search, Notifications, Help, Manage Roles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#121319] py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-colors focus:border-white/20"
          />
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            className="flex size-8.5 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8.5 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Help"
          >
            <HelpCircle className="size-4" />
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <button
            type="button"
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Manage Roles
            <ChevronDown className="size-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 2. Page Title & Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            User Management
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Review, filter, and manage platform access for all users.
          </p>
        </div>

        {/* Filter and Export buttons */}
        <div className="flex items-center gap-2.5">
          {/* Role Filter Dropdown */}
          <div className="relative inline-block">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none cursor-pointer rounded-lg border border-white/10 bg-[#121319] px-3.5 py-1.5 pr-8 text-xs font-medium text-zinc-200 outline-none hover:bg-white/5"
            >
              <option value="all" className="bg-[#14151b] text-zinc-200">
                All Roles
              </option>
              <option value="seeker" className="bg-[#14151b] text-zinc-200">
                Seekers
              </option>
              <option value="recruiter" className="bg-[#14151b] text-zinc-200">
                Recruiters
              </option>
              <option value="admin" className="bg-[#14151b] text-zinc-200">
                Admins
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
          </div>

          {/* Export List Button */}
          <button
            type="button"
            onClick={() => toast.success("User list exported successfully")}
            className="rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Export List
          </button>
        </div>
      </div>

      {/* 3. Stat Cards (4 Cards exactly from Image 1) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Active Users */}
        <div className="space-y-2 rounded-2xl border border-white/5 bg-[#101116] p-5">
          <p className="text-xs font-medium text-zinc-400">Total Active Users</p>
          <p className="text-2xl font-bold tracking-tight text-white">12,842</p>
          <p className="text-xs font-medium text-emerald-400">
            +12% vs last month
          </p>
        </div>

        {/* Card 2: Recruiter Growth */}
        <div className="space-y-2 rounded-2xl border border-white/5 bg-[#101116] p-5">
          <p className="text-xs font-medium text-zinc-400">Recruiter Growth</p>
          <p className="text-2xl font-bold tracking-tight text-white">843</p>
          <p className="text-xs font-medium text-emerald-400">High demand</p>
        </div>

        {/* Card 3: Suspended Accounts */}
        <div className="space-y-2 rounded-2xl border border-white/5 bg-[#101116] p-5">
          <p className="text-xs font-medium text-zinc-400">Suspended Accounts</p>
          <p className="text-2xl font-bold tracking-tight text-white">124</p>
          <p className="text-xs font-medium text-zinc-500">0.8% of total</p>
        </div>

        {/* Card 4: New Signups (24h) */}
        <div className="space-y-2 rounded-2xl border border-white/5 bg-[#101116] p-5">
          <p className="text-xs font-medium text-zinc-400">New Signups (24h)</p>
          <p className="text-2xl font-bold tracking-tight text-white">42</p>
          <p className="text-xs font-medium text-amber-500">Steady activity</p>
        </div>
      </div>

      {/* 4. Users Table (Exactly matching Image 2, zero scroll behaviour) */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0d0e12]">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-400">
            No users found matching your criteria.
          </div>
        ) : (
          <div className="w-full overflow-x-auto lg:overflow-x-visible">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-white/5 bg-white/2">
                <tr>
                  <th className="py-3.5 pl-6 pr-4 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                    User Name
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                    Email Address
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase whitespace-nowrap">
                    Join Date
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                    Status
                  </th>
                  <th className="pl-4 pr-6 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => {
                  const initial = user.name
                    ? user.name.trim().charAt(0).toUpperCase()
                    : "U";

                  const roleFormatted = capitalize(user.role || "seeker");

                  return (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-white/2"
                    >
                      {/* 1. User Name with initial avatar */}
                      <td className="py-4 pl-6 pr-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#181922] text-xs font-bold text-white">
                            {initial}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {user.name || "job Pabi Insallah"}
                          </span>
                        </div>
                      </td>

                      {/* 2. Email Address */}
                      <td className="px-4 py-4 text-sm text-zinc-400 align-middle">
                        {user.email}
                      </td>

                      {/* 3. Role Capsule Pill with Dot */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/40 px-3 py-0.5 text-xs font-medium text-zinc-300">
                          <span className="size-1.5 rounded-full bg-zinc-400" />
                          {roleFormatted}
                        </span>
                      </td>

                      {/* 4. Join Date */}
                      <td className="px-4 py-4 text-sm text-zinc-300 align-middle whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* 5. Status Badge */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-0.5 text-xs font-medium text-emerald-400">
                          Active
                        </span>
                      </td>

                      {/* 6. Actions Dropdown */}
                      <td className="pl-4 pr-6 py-4 align-middle whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={user.role || "seeker"}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className="appearance-none cursor-pointer rounded-lg border border-white/10 bg-[#16171d] px-3 py-1.5 pr-8 text-xs font-medium text-zinc-200 outline-none transition-colors hover:bg-white/5"
                          >
                            <option
                              value="seeker"
                              className="bg-[#14151b] text-zinc-200"
                            >
                              Make Seeker
                            </option>
                            <option
                              value="recruiter"
                              className="bg-[#14151b] text-zinc-200"
                            >
                              Make Recruiter
                            </option>
                            <option
                              value="admin"
                              className="bg-[#14151b] text-zinc-200"
                            >
                              Make Admin
                            </option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
