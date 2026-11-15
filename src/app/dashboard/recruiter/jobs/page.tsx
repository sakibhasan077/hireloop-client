import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ChevronRight,
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import type { JobForm, JobStatus } from "@/app/dashboard/_components/NewJobForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { getJobs } from "@/lib/api/job";
import { cn } from "@/lib/utils";
import { DeleteJobDialog } from "../../_components/DeleteJobDialog";

export const metadata: Metadata = {
  title: "Manage Job Posts — HireLoop",
  description:
    "Review live listings, monitor applicants, and update job details across your organization.",
};

/**
 * A job listing shown in the management table.
 */
export type JobPost = JobForm & {
  _id: string;
  postedAt: string;
};

// Date formatter for "Dec 04, 2026"
const deadlineFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Formats date into "MMM DD, YYYY" (e.g., "Dec 04, 2026")
 */
function formatDeadline(value?: string): string {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? value : deadlineFormatter.format(date);
}

/**
 * Formats location text (e.g., "Remote (Khulna)" or "On-site")
 */
function formatLocation(job: JobPost): string {
  if (job.remote) {
    return job.jobLocation ? `Remote (${job.jobLocation})` : "Remote";
  }
  return job.jobLocation || "On-site";
}

/**
 * Gets the first character of the job title for the avatar logo
 */
function getInitial(title?: string): string {
  return title ? title.trim().charAt(0).toUpperCase() : "J";
}

/**
 * Rounded square avatar with first letter of the job title
 */
function JobInitialLogo({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#2e3152]/40 bg-[#18192b] text-sm font-bold text-[#818cf8]"
    >
      {getInitial(title)}
    </div>
  );
}

/**
 * Job type pill badge (e.g. "Full-Time")
 */
function JobTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-[#1a1b22] px-3 py-1 text-xs font-medium text-zinc-300 whitespace-nowrap">
      {type || "Full-Time"}
    </span>
  );
}

/**
 * Status pill badge with corresponding colors
 */
const statusColorMap: Record<string, string> = {
  Active: "bg-[#0d2a1f] text-[#22c55e] border-[#166534]/50",
  Pending: "bg-[#1e1b4b]/60 text-[#a5b4fc] border-[#4338ca]/40",
  Paused: "bg-[#2a1d0d] text-[#f59e0b] border-[#78350f]/50",
  Draft: "bg-[#181920] text-[#94a3b8] border-[#334155]/50",
  Expired: "bg-[#2a0d0d] text-[#ef4444] border-[#7f1d1d]/50",
};

function JobStatusBadge({ status }: { status: JobStatus | string }) {
  const colorClass =
    statusColorMap[status] || "bg-[#0d2a1f] text-[#22c55e] border-[#166534]/50";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium whitespace-nowrap",
        colorClass
      )}
    >
      {status || "Active"}
    </span>
  );
}

/**
 * Applicants count with Users icon
 */
function JobApplicants({ count }: { count?: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-zinc-300 whitespace-nowrap">
      <Users className="size-3.5 shrink-0 text-zinc-400" />
      <span>{count || 0} candidates</span>
    </div>
  );
}

/**
 * Formats compensation preserving every piece of data.
 * Returns amount and frequency separately so they can wrap to a 2nd line if space is tight,
 * preventing any horizontal scrolling or overlapping.
 */
function getCompensationParts(job: JobPost): {
  amount: string;
  frequency: string;
} {
  const min = job.minSalary?.toString().trim();
  const max = job.maxSalary?.toString().trim();

  let freq = "";
  if (job.frequency) {
    const raw = job.frequency.trim();
    if (raw.toLowerCase().startsWith("per ")) {
      freq = `/ ${raw.slice(4)}`;
    } else if (raw.startsWith("/")) {
      freq = raw;
    } else {
      freq = `/ ${raw}`;
    }
  }

  if (!min && !max) {
    return { amount: "Not disclosed", frequency: "" };
  }

  if (min && max) {
    return {
      amount: `€${min} – €${max}`,
      frequency: freq,
    };
  }

  return {
    amount: `€${min || max}`,
    frequency: freq,
  };
}

/**
 * The 4 action icons:
 * 1. FileText: View public listing (/brows-jobs/[id])
 * 2. Eye: View recruiter details (/dashboard/recruiter/jobs/[jobId])
 * 3. Pencil: Edit job (/dashboard/recruiter/jobs/updateJobs/[jobId])
 * 4. Trash2: Delete job dialog
 */
function JobActions({ job }: { job: JobPost }) {
  return (
    <div className="flex items-center justify-end gap-.5 whitespace-nowrap">
      {/* 1. View public posting */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/brows-jobs/${job._id}`}
              className="flex size-7.5 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label={`View public listing for ${job.jobTitle}`}
            >
              <FileText className="size-3.5" />
            </Link>
          }
        />
        <TooltipContent>View public posting</TooltipContent>
      </Tooltip>

      {/* 2. View details */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/dashboard/recruiter/jobs/${job._id}`}
              className="flex size-7.5 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label={`View job details for ${job.jobTitle}`}
            >
              <Eye className="size-3.5" />
            </Link>
          }
        />
        <TooltipContent>View job details</TooltipContent>
      </Tooltip>

      {/* 3. Edit job */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/dashboard/recruiter/jobs/updateJobs/${job._id}`}
              className="flex size-7.5 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label={`Edit ${job.jobTitle}`}
            >
              <Pencil className="size-3.5" />
            </Link>
          }
        />
        <TooltipContent>Edit job</TooltipContent>
      </Tooltip>

      {/* 4. Delete job */}
      <Tooltip>
        <TooltipTrigger
          render={
            <DeleteJobDialog
              job={job}
              trigger={
                <button
                  type="button"
                  className="flex size-7.5 cursor-pointer items-center justify-center rounded-lg border border-red-900/30 bg-[#2d1215] text-[#f87171] transition-colors hover:bg-[#3f161a]"
                  aria-label={`Delete ${job.jobTitle}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              }
            />
          }
        />
        <TooltipContent>Delete job</TooltipContent>
      </Tooltip>
    </div>
  );
}

/**
 * Mobile / Small screen card view:
 * Stacks details cleanly to ensure 100% responsiveness WITHOUT horizontal scrolling.
 */
function MobileJobCard({ job }: { job: JobPost }) {
  const { amount, frequency } = getCompensationParts(job);

  return (
    <li className="space-y-4 p-4 transition-colors hover:bg-white/[0.02]">
      {/* Header: Logo, Title, Category, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <JobInitialLogo title={job.jobTitle} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {job.jobTitle}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {job.jobCategory}
            </p>
          </div>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
        <div>
          <span className="block text-zinc-500">Company &amp; Location</span>
          <p className="mt-0.5 truncate font-medium text-zinc-200">
            {job.companyName}
          </p>
          <p className="truncate text-zinc-400">{formatLocation(job)}</p>
        </div>

        <div>
          <span className="block text-zinc-500">Job Type</span>
          <div className="mt-1">
            <JobTypeBadge type={job.jobType} />
          </div>
        </div>

        <div>
          <span className="block text-zinc-500">Compensation</span>
          <p className="mt-0.5 font-medium text-zinc-200">
            {amount} {frequency}
          </p>
        </div>

        <div>
          <span className="block text-zinc-500">Applicants</span>
          <div className="mt-0.5">
            <JobApplicants count={job.applicants} />
          </div>
        </div>

        <div className="col-span-2">
          <span className="block text-zinc-500">Deadline</span>
          <p className="mt-0.5 text-zinc-300">
            {formatDeadline(job.applicationDeadline)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end border-t border-white/5 pt-2">
        <JobActions job={job} />
      </div>
    </li>
  );
}

const ManageJobsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const jobsData = await getJobs(`recruiterId=${session?.user.id}`);
  const jobs: JobPost[] = Array.isArray(jobsData) ? jobsData : [];

  return (
    <TooltipProvider>
      <main className="font-inter min-h-screen bg-[#09090b] px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {/* Header */}
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Manage Jobs</span>
                <ChevronRight className="size-3.5" />
                <span>Job Listings &amp; Postings</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                Manage Job Posts
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Review live listings, monitor applicants, and update job details
                across your organization.
              </p>
            </div>

            <Button
              nativeButton={false}
              className="bg-[#5C53FE] text-white hover:bg-[#5C53FE]/90 cursor-pointer"
              render={<Link href="/dashboard/recruiter/jobs/new" />}
            >
              <Plus className="size-4" />
              New Job Post
            </Button>
          </header>

          {/* Main Card Container — overflow-hidden guarantees no horizontal scrolling */}
          <Card className="gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] py-0 ring-0">
            {jobs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-zinc-400">No job posts found.</p>
                <Button
                  nativeButton={false}
                  size="sm"
                  className="mt-4 bg-[#5C53FE] text-white hover:bg-[#5C53FE]/90 cursor-pointer"
                  render={<Link href="/dashboard/recruiter/jobs/new" />}
                >
                  <Plus className="size-4" />
                  Create First Job Post
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile / Small Screens: Clean stacked cards (No horizontal scroll behaviour) */}
                <ul className="divide-y divide-white/5 md:hidden">
                  {jobs.map((job) => (
                    <MobileJobCard key={job._id} job={job} />
                  ))}
                </ul>

                {/* Desktop/Tablet Table: Zero horizontal scroll behaviour, wrapping naturally if needed */}
                <div className="hidden md:block w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/[0.02] border-b border-white/5">
                      <tr>
                        <th className="py-3.5 pl-5 pr-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Job Title &amp; Dept
                        </th>
                        <th className="px-3 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Company &amp; Location
                        </th>
                        <th className="px-3 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Type
                        </th>
                        <th className="px-3 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Compensation
                        </th>
                        <th className="px-3 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Applicants
                        </th>
                        <th className="px-3 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Status
                        </th>
                        <th className="px-3 py-3.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Deadline
                        </th>
                        <th className="py-3.5 pl-2 pr-2 text-center text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                      {jobs.map((job) => {
                        const { amount, frequency } = getCompensationParts(job);

                        return (
                          <tr
                            key={job._id}
                            className="transition-colors hover:bg-white/[0.02]"
                          >
                            {/* 1. Job Title & Dept */}
                            <td className="py-4 pl-5 pr-3 align-middle">
                              <div className="flex items-center gap-3">
                                <JobInitialLogo title={job.jobTitle} />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white leading-snug">
                                    {job.jobTitle}
                                  </p>
                                  <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                                    {job.jobCategory}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* 2. Company & Location */}
                            <td className="px-3 py-4 align-middle">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-200 leading-snug">
                                  {job.companyName}
                                </p>
                                <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                                  {formatLocation(job)}
                                </p>
                              </div>
                            </td>

                            {/* 3. Type */}
                            <td className="px-3 py-4 align-middle">
                              <JobTypeBadge type={job.jobType} />
                            </td>

                            {/* 4. Compensation — preserves every digit, wraps naturally to a second line if space is tight */}
                            <td className="px-3 py-4 align-middle">
                              <div className="text-sm font-medium text-zinc-200 leading-tight">
                                <span className="whitespace-nowrap">{amount}</span>
                                {frequency && (
                                  <span className="block text-xs font-normal text-zinc-400 sm:inline sm:ml-1 sm:text-sm sm:font-medium sm:text-zinc-200">
                                    {frequency}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 5. Applicants */}
                            <td className="px-3 py-4 align-middle">
                              <JobApplicants count={job.applicants} />
                            </td>

                            {/* 6. Status */}
                            <td className="px-3 py-4 align-middle">
                              <JobStatusBadge status={job.status} />
                            </td>

                            {/* 7. Deadline */}
                            <td className="px-3 py-4 align-middle whitespace-nowrap">
                              <span className="text-sm text-zinc-300">
                                {formatDeadline(job.applicationDeadline)}
                              </span>
                            </td>

                            {/* 8. Actions */}
                            <td className="py-4 pl-3 pr-5 text-right align-middle">
                              <JobActions job={job} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
    </TooltipProvider>
  );
};

export default ManageJobsPage;
