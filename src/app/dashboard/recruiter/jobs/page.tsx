import type { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Code2,
  Copy,
  EllipsisVertical,
  MapPin,
  Megaphone,
  Palette,
  Pencil,
  Plus,
  Server,
  ShieldCheck,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { JobForm } from "@/app/dashboard/_components/NewJobForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getJobs } from "@/lib/api/job";

export const metadata: Metadata = {
  title: "Manage Job Posts — HireLoop",
  description:
    "Review live listings, monitor applicants, and update job details across your organization.",
};

type JobStatus = "Active" | "Paused" | "Draft" | "Expired";

/**
 * A job listing as shown in the management table. The core listing fields come
 * from the job form; the remaining fields are management-only metadata.
 */
type JobPost = JobForm & {
  _id: string;
  applicants: number;
  status: JobStatus;
  postedAt: string;
};

const categoryVisuals: Record<string, { icon: LucideIcon; className: string }> = {
  "Engineering & Tech": {
    icon: Code2,
    className: "bg-[#5C53FE]/15 text-[#5C53FE]",
  },
  Design: { icon: Palette, className: "bg-orange-500/15 text-orange-400" },
  Infrastructure: { icon: Server, className: "bg-sky-500/15 text-sky-400" },
  Marketing: { icon: Megaphone, className: "bg-pink-500/15 text-pink-400" },
  Quality: { icon: ShieldCheck, className: "bg-emerald-500/15 text-emerald-400" },
}; // It has a problem , It's not dynamic

const fallbackVisual = {
  icon: BriefcaseBusiness,
  className: "bg-white/5 text-muted-foreground",
};

const statusStyles: Record<JobStatus, { badge: string; dot: string }> = {
  Active: {
    badge: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
  Paused: {
    badge: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },
  Draft: {
    badge: "bg-sky-500/10 text-sky-400",
    dot: "bg-sky-400",
  },
  Expired: {
    badge: "bg-white/5 text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

const frequencySuffix: Record<string, string> = {
  "per hour": "/ hr",
  "per day": "/ day",
  "per month": "/ mo",
  "per year": "/ yr",
};

const deadlineFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatMoney(value: string, frequency: string) {
  const amount = Number(value);
  if (!value.trim() || Number.isNaN(amount)) {
    return null;
  }

  if (frequency === "per year" && amount >= 1000) {
    return `€${Math.round(amount / 1000)}k`;
  }

  return `€${amount.toLocaleString("en-US")}`;
}

function formatCompensation(job: JobPost) {
  const min = formatMoney(job.minSalary, job.frequency);
  const max = formatMoney(job.maxSalary, job.frequency);
  const suffix = frequencySuffix[job.frequency] ?? "";

  if (!min && !max) {
    return { amount: "Not disclosed", suffix: "" };
  }

  if (min && max) {
    return { amount: `${min} - ${max}`, suffix };
  }

  return { amount: min ?? max!, suffix };
}

function formatDeadline(value: string) {
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? value : deadlineFormatter.format(date);
}

function JobLogo({ category }: { category: string }) {
  const { icon: Icon, className } = categoryVisuals[category] ?? fallbackVisual;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg",
        className
      )}
    >
      <Icon className="size-4" />
    </span>
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  const styles = statusStyles[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-transparent px-2 text-[11px] font-medium",
        styles?.badge || ""
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles?.dot)} />
      {status}
    </Badge>
  );
}

function Compensation({ job }: { job: JobPost }) {
  const { amount, suffix } = formatCompensation(job);

  return (
    <span className="text-sm font-medium">
      {amount}
      {suffix ? (
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

function Location({ job }: { job: JobPost }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <MapPin className="size-3.5 shrink-0" />
      {job.jobLocation}
      {job.remote ? (
        <span className="font-medium text-[#5C53FE]">· Remote</span>
      ) : null}
    </span>
  );
}

function JobActions({ job }: { job: JobPost }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="border-white/10 bg-[#5C53FE]/3 hover:bg-white/[0.07]"
        aria-label={`View ${job.jobTitle}`}
      >
        <Pencil />
        View
      </Button>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-red-400"
              aria-label={`Delete ${job.jobTitle}`}
            />
          }
        >
          <Trash2 />
        </TooltipTrigger>
        <TooltipContent>Delete job post</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Duplicate ${job.jobTitle}`}
            />
          }
        >
          <EllipsisVertical/>
        </TooltipTrigger>
        {/* <TooltipContent>Duplicate job post</TooltipContent> */}
      </Tooltip>
    </div>
  );
}

function Deadline({ job }: { job: JobPost }) {
  return (
    <div>
      <p className="text-sm">{formatDeadline(job.applicationDeadline)}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {job.status === "Expired" ? "Closed" : `Posted ${job.postedAt}`}
      </p>
    </div>
  );
}

function MobileJobCard({ job }: { job: JobPost }) {
  return (
    <li className="space-y-4 p-4 transition-colors hover:bg-white/3">
      <div className="flex items-start gap-3">
        <JobLogo category={job.jobCategory} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{job.jobTitle}</p>
          <p className="truncate text-xs text-muted-foreground">
            {job.jobCategory} · {job.companyName}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        <div className="min-w-0">
          <dt className="text-muted-foreground">Location</dt>
          <dd className="mt-0.5 truncate">
            <Location job={job} />
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Job type</dt>
          <dd className="mt-0.5">{job.jobType}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Compensation</dt>
          <dd className="mt-0.5">
            <Compensation job={job} />
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Applicants</dt>
          <dd className="mt-0.5 flex items-center gap-1.5">
            <Users className="size-3.5 text-muted-foreground" />
            {job.applicants} Candidates
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Deadline</dt>
          <dd className="mt-0.5">
            <Deadline job={job} />
          </dd>
        </div>
      </dl>

      <JobActions job={job} />
    </li>
  );
}

const ManageJobsPage = async() => {
  const jobs:JobPost[] = await getJobs();
  return (
    <TooltipProvider>
      <main className="min-h-screen bg-[#09090b] px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Manage Jobs</span>
                <ChevronRight className="size-3.5" />
                <span>Job Listings &amp; Postings</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                Manage Job Posts
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Review live listings, monitor applicants, and update job details
                across your organization.
              </p>
            </div>

            <Button
              nativeButton={false}
              className="bg-[#5C53FE] text-white hover:bg-[#5C53FE]/90"
              render={<Link href="/dashboard/recruiter/jobs/new" />}
            >
              <Plus />
              New Job Post
            </Button>
          </header>

          <Card className="gap-0 overflow-hidden bg-[#101012] py-0 ring-white/10">
            {/* Mobile: stacked cards keep every field readable without horizontal scrolling. */}
            <ul className="divide-y divide-white/5 md:hidden">
              {jobs.map((job) => (
                <MobileJobCard key={job._id} job={job} />
              ))}
            </ul>

            {/* Desktop/tablet: full table with progressively revealed columns. */}
            <div className="hidden md:block">
              <Table className="min-w-160">
                <TableHeader className="bg-white/3">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="py-3 pl-5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Job Title &amp; Dept
                    </TableHead>
                    <TableHead className="hidden py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase xl:table-cell">
                      Company &amp; Location
                    </TableHead>
                    <TableHead className="py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Type
                    </TableHead>
                    <TableHead className="py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Compensation
                    </TableHead>
                    <TableHead className="hidden py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase xl:table-cell">
                      Applicants
                    </TableHead>
                    <TableHead className="py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Status
                    </TableHead>
                    <TableHead className="hidden py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase lg:table-cell">
                      Deadline
                    </TableHead>
                    <TableHead className="py-3 pr-5 text-right text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {jobs.map((job) => (
                    <TableRow
                      key={job._id}
                      className="border-white/5 hover:bg-white/3"
                    >
                      <TableCell className="max-w-60 py-4 pl-5">
                        <div className="flex items-center gap-3">
                          <JobLogo category={job.jobCategory} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {job.jobTitle}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {job.jobCategory}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden max-w-55 xl:table-cell">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate text-sm">
                            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                            {job.companyName}
                          </p>
                          <Location job={job} />
                        </div>
                      </TableCell>

                      <TableCell className="text-sm">{job.jobType}</TableCell>

                      <TableCell>
                        <Compensation job={job} />
                      </TableCell>

                      <TableCell className="hidden xl:table-cell">
                        <span className="flex items-center gap-1.5">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span className="text-sm">{job.applicants}</span>
                          <span className="text-xs text-muted-foreground">
                            Candidates
                          </span>
                        </span>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={job.status} />
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <Deadline job={job} />
                      </TableCell>

                      <TableCell className="pr-5">
                        <JobActions job={job} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </TooltipProvider>
  );
};

export default ManageJobsPage;