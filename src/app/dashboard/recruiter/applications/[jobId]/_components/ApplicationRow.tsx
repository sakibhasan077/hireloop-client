"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import { updateApplicationStatus } from "@/lib/actions/jobs";

// Options matching the dropdown in the picture
const STATUS_OPTIONS = [
  "Applied",
  "Review",
  "Interview",
  "Shortlisted",
  "Rejected",
  "Offered",
];

// Color styling for each status badge matching the picture
const statusStyles: Record<string, string> = {
  Review: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Interview: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  Shortlisted: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  Offered: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Rejected: "text-red-400 bg-red-500/10 border-red-500/30",
  Applied: "text-zinc-300 bg-zinc-800/60 border-zinc-700/50",
};

export type Application = {
  _id: string;
  userEmail?: string;
  appliedAt?: string;
  status?: string;
};

// Converts ISO timestamp (e.g. 2026-11-15T10:33:33.237Z) to normal time (sec, min, hour, day)
function formatRelativeTime(dateString?: string) {
  if (!dateString) return "Recently";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Seconds
  if (diffInSeconds < 60) {
    return `${diffInSeconds <= 1 ? "1 second" : `${diffInSeconds} seconds`} ago`;
  }

  // Minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  // Hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  // Days
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}

export function ApplicationRow({ app }: { app: Application }) {
  // Store the status so it updates immediately when the user selects a new one
  const [status, setStatus] = useState(app.status || "Applied");

  // Handle dropdown change
  const handleStatusChange = async (newStatus: string) => {
    // 1. Update the badge and dropdown in UI right away
    setStatus(newStatus);

    // 2. Save the change to the database
    const result = await updateApplicationStatus(app._id,{status:newStatus})
    if(result.modifiedCount > 0){
      toast.success(`Status updated to ${newStatus}`);
    }
    else{
      toast.error("Failed to update status");
    }
    // try {
    //   await updateApplicationStatus(app._id, newStatus);
    //   toast.success(`Status updated to ${newStatus}`);
    // } catch {
    //   toast.error("Failed to update status");
    // }
  };

  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      {/* 1. Applicant Email */}
      <td className="py-4 pl-6 pr-4 text-sm font-medium text-zinc-200 align-middle">
        {app.userEmail || "Applicant"}
      </td>

      {/* 2. Applied Time */}
      <td className="px-4 py-4 text-sm text-zinc-400 align-middle whitespace-nowrap">
        {formatRelativeTime(app.appliedAt)}
      </td>

      {/* 3. Status Badge */}
      <td className="px-4 py-4 align-middle whitespace-nowrap">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${
            statusStyles[status] || statusStyles.Applied
          }`}
        >
          {status}
        </span>
      </td>

      {/* 4. Update Status Dropdown */}
      <td className="pl-4 pr-6 py-4 align-middle whitespace-nowrap">
        <div className="relative inline-block">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none cursor-pointer rounded-lg border border-white/10 bg-[#16171d] px-3 py-1.5 pr-8 text-xs font-medium text-zinc-200 outline-none hover:bg-white/5"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#14151b] text-zinc-200">
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
        </div>
      </td>
    </tr>
  );
}
