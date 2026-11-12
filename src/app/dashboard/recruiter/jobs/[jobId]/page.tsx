import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  ChevronRight,
  Clock,
  GraduationCap,
  Laptop,
  ListChecks,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { JobStatus } from "@/app/dashboard/_components/NewJobForm";
import { DeleteJobDialog } from "@/app/dashboard/_components/DeleteJobDialog";
import type { JobPost } from "@/app/dashboard/recruiter/jobs/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getSpecificJobData } from "@/lib/api/job";

export const metadata: Metadata = {
  title: "Job Details — HireLoop",
  description: "Review the full details of a job posting on HireLoop.",
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

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function formatMoney(value: string) {
  const amount = Number(value);
  if (!value.trim() || Number.isNaN(amount)) {
    return null;
  }

  return amount.toLocaleString("en-US");
}

function formatCompensation(job: JobPost) {
  const min = formatMoney(job.minSalary);
  const max = formatMoney(job.maxSalary);
  const suffix = frequencySuffix[job.frequency] ?? "";

  if (!min && !max) {
    return { amount: "Not disclosed", suffix: "" };
  }

  if (min && max) {
    return { amount: `€${min} - €${max}`, suffix };
  }

  return { amount: `€${min ?? max}`, suffix };
}

function StatusBadge({ status }: { status: JobStatus }) {
  const styles = statusStyles[status] ?? statusStyles.Expired;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-transparent px-2.5 text-xs font-medium",
        styles.badge
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} />
      {status}
    </Badge>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

function DetailSection({
  icon: Icon,
  title,
  content,
  emptyText,
}: {
  icon: LucideIcon;
  title: string;
  content: string;
  emptyText: string;
}) {
  return (
    <Card className="bg-[#101012] ring-white/10">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-[#5C53FE]">
            <Icon className="size-4" />
          </span>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        {content.trim() ? (
          <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
            {content}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;
  const job = (await getSpecificJobData(jobId)) as JobPost | null;

  if (!job || !job.jobTitle) {
    notFound();
  }

  const compensation = formatCompensation(job);

  return (
    <main className="font-inter min-h-screen bg-[#09090b] px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              href="/dashboard/recruiter/jobs"
              aria-label="Back to manage jobs"
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                <Link
                  href="/dashboard/recruiter/jobs"
                  className="transition-colors hover:text-foreground"
                >
                  Manage Jobs
                </Link>
                <ChevronRight className="size-3.5 shrink-0" />
                <span>Job Details</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight break-words">
                {job.jobTitle}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Review the full listing, requirements, and compensation details.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <StatusBadge status={job.status} />
          </div>
        </header>

        {/* Overview */}
        <Card className="bg-[#101012] ring-white/10">
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#5C53FE]/15 text-[#5C53FE]"
              >
                <BriefcaseBusiness className="size-6" />
              </span>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold break-words">
                    {job.jobTitle}
                  </h2>
                  <Badge
                    variant="outline"
                    className="border-white/10 text-xs text-muted-foreground"
                  >
                    {job.jobType}
                  </Badge>
                  {job.remote ? (
                    <Badge
                      variant="outline"
                      className="gap-1 border-[#5C53FE]/30 bg-[#5C53FE]/10 px-2 text-xs text-[#5C53FE]"
                    >
                      <Laptop className="size-3" />
                      Remote
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-4 shrink-0" />
                    <span className="truncate">
                      {job.companyName || "Company not specified"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">{job.jobLocation}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-4 shrink-0" />
                    <span className="truncate">{job.jobCategory}</span>
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
              <Stat
                icon={Users}
                label="Applicants"
                value={`${job.applicants ?? 0} Candidates`}
              />
              <Stat
                icon={Banknote}
                label="Compensation"
                value={
                  <>
                    {compensation.amount}
                    {compensation.suffix ? (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {compensation.suffix}
                      </span>
                    ) : null}
                  </>
                }
              />
              <Stat
                icon={CalendarDays}
                label="Application Deadline"
                value={formatDate(job.applicationDeadline)}
              />
              <Stat
                icon={Clock}
                label="Posted"
                value={formatDate(job.postedAt)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <DetailSection
              icon={ListChecks}
              title="Key Responsibilities"
              content={job.responsibilities}
              emptyText="No responsibilities have been added to this listing."
            />
            <DetailSection
              icon={GraduationCap}
              title="Qualifications & Requirements"
              content={job.qualifications}
              emptyText="No qualifications have been added to this listing."
            />
          </div>

          <aside className="space-y-6">
            <Card className="bg-[#101012] ring-white/10">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-[#5C53FE]">
                    <Banknote className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Compensation</h2>
                </div>

                <div>
                  <p className="text-xl font-semibold">
                    {compensation.amount}
                    {compensation.suffix ? (
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        {compensation.suffix}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.frequency ? `Rate ${job.frequency}` : "Rate not specified"}
                  </p>
                </div>

                <Separator className="bg-white/10" />

                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Min</dt>
                    <dd className="mt-0.5 font-medium">
                      {formatMoney(job.minSalary)
                        ? `€${formatMoney(job.minSalary)}`
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Max</dt>
                    <dd className="mt-0.5 font-medium">
                      {formatMoney(job.maxSalary)
                        ? `€${formatMoney(job.maxSalary)}`
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="bg-[#101012] ring-white/10">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-[#5C53FE]">
                    <CalendarClock className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Timeline</h2>
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>
                      <StatusBadge status={job.status} />
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground">Posted on</dt>
                    <dd className="text-right font-medium">
                      {formatDate(job.postedAt)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground">Deadline</dt>
                    <dd className="text-right font-medium">
                      {formatDate(job.applicationDeadline)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground">Applicants</dt>
                    <dd className="text-right font-medium">
                      {job.applicants ?? 0} Candidates
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="bg-[#101012] ring-white/10">
              <CardContent className="space-y-3">
                <h2 className="text-sm font-semibold">Actions</h2>
                <Button
                  nativeButton={false}
                  className="w-full justify-center border-[#5C53FE]/30 bg-[#5C53FE]/10 text-[#5C53FE] hover:bg-[#5C53FE]/20"
                  variant="outline"
                  render={<Link href="/dashboard/recruiter/jobs" />}
                >
                  Back to All Jobs
                </Button>
                <div className="flex justify-center pt-1">
                  <DeleteJobDialog job={job} />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default JobDetailsPage;
