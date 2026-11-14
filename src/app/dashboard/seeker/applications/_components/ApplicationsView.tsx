"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { IJobApplicationResponse } from "./types";

type Tab = "active" | "archived";

type ApplicationStat = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

const PAGE_SIZE = 5;

const statusStyles: Record<string, string> = {
  applied: "border-white/10 bg-white/5 text-zinc-300",
  active: "border-white/10 bg-white/5 text-zinc-300",
  review: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  shortlisted: "border-sky-500/20 bg-sky-500/10 text-sky-400",
  interview: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  rejected: "border-red-500/20 bg-red-500/10 text-red-400",
  offered: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  accepted: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

const companyLogoStyles: Record<string, string> = {
  "Stark Industries": "bg-white text-black",
  "Cyberdyne Systems": "bg-zinc-600 text-white",
  "Wayne Enterprises": "bg-indigo-500/20 text-indigo-300",
  Descope: "bg-red-600 text-white",
  Hooli: "bg-emerald-500/15 text-emerald-400",
};

const relativeTime = new Intl.RelativeTimeFormat("en", {
  numeric: "always",
});

const timeDivisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
];

/** Turns an ISO timestamp into labels like "2 hours ago" or "2 weeks ago". */
function formatAppliedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  let duration = (date.getTime() - Date.now()) / 1000;

  for (const division of timeDivisions) {
    if (Math.abs(duration) < division.amount) {
      return relativeTime.format(Math.round(duration), division.unit);
    }

    duration /= division.amount;
  }

  return value;
}

function statusKey(application: IJobApplicationResponse) {
  return application.status.trim().toLowerCase();
}

function locationLabel(application: IJobApplicationResponse) {
  return application.remote ? "Remote" : application.jobLocation;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 shrink-0 rounded-full px-2.5 text-[11px] font-medium capitalize",
        statusStyles[status.trim().toLowerCase()] ??
          "border-white/10 bg-white/5 text-muted-foreground",
      )}
    >
      {status}
    </Badge>
  );
}

function CompanyLogo({ company }: { company: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold",
        companyLogoStyles[company] ?? "bg-white/10 text-white",
      )}
    >
      {company.charAt(0)}
    </span>
  );
}

function AppliedAt({ value }: { value: string }) {
  return (
    <time dateTime={value} suppressHydrationWarning>
      {formatAppliedAt(value)}
    </time>
  );
}

function StatCard({ label, value, highlight }: ApplicationStat) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#101012] px-4 py-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight text-white",
          highlight && "text-emerald-400",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Tabs({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Application status"
      className="inline-flex items-center rounded-lg border border-white/10 bg-[#101012] p-0.5"
    >
      {(["active", "archived"] as const).map((tab) => (
        <button
          key={tab}
          id={`applications-tab-${tab}`}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls="applications-panel"
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
            activeTab === tab
              ? "bg-white/10 text-white"
              : "text-muted-foreground hover:text-white",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function MobileApplicationCard({
  application,
}: {
  application: IJobApplicationResponse;
}) {
  return (
    <li className="space-y-3 p-4 transition-colors hover:bg-white/3">
      <div className="flex items-start gap-3">
        <CompanyLogo company={application.companyName} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {application.jobTitle}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {application.companyName}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>{application.jobType}</span>
            <span aria-hidden="true">·</span>
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{locationLabel(application)}</span>
          </p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="flex items-center justify-between gap-3 pl-11">
        <p className="text-xs text-muted-foreground">
          <AppliedAt value={application.appliedAt} />
        </p>

        <Link
          href={`/brows-jobs/${application.jobId}`}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-white"
        >
          Details
        </Link>
      </div>
    </li>
  );
}

function ApplicationsTable({
  applications,
}: {
  applications: IJobApplicationResponse[];
}) {
  return (
    <Table>
      <TableHeader className="bg-white/3">
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="py-3 pl-5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Job Title
          </TableHead>
          <TableHead className="hidden py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase sm:table-cell sm:w-44">
            Company
          </TableHead>
          <TableHead className="hidden py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase md:table-cell md:w-28">
            Applied
          </TableHead>
          <TableHead className="w-28 py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Status
          </TableHead>
          <TableHead className="w-20 py-3 pr-5 text-right text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {applications.map((application) => (
          <TableRow
            key={application._id}
            className="border-white/5 hover:bg-white/3"
          >
            <TableCell className="py-4 pl-5 whitespace-normal">
              <div className="flex items-center gap-3">
                <CompanyLogo company={application.companyName} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {application.jobTitle}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {application.jobType} · {locationLabel(application)}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="hidden truncate text-sm text-muted-foreground sm:table-cell">
              {application.companyName}
            </TableCell>

            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
              <AppliedAt value={application.appliedAt} />
            </TableCell>

            <TableCell>
              <StatusBadge status={application.status} />
            </TableCell>

            <TableCell className="pr-5 text-right">
              <Link
                href={`/brows-jobs/${application.jobId}`}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-white"
              >
                Details
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
        <Archive className="size-4" />
      </span>
      <p className="mt-3 text-sm font-medium text-white">
        No applications to show
      </p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Applications will appear here once you start applying.
      </p>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Applications pagination"
      className="flex flex-wrap items-center gap-1"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex size-7 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-3.5" />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onChange(pageNumber)}
          className={cn(
            "flex size-7 items-center justify-center rounded-md border text-xs font-medium transition-colors",
            pageNumber === page
              ? "border-white bg-white text-black"
              : "border-white/10 text-muted-foreground hover:text-white",
          )}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="flex size-7 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-3.5" />
      </button>
    </nav>
  );
}

export function ApplicationsView({
  appliedData,
}: {
  appliedData: IJobApplicationResponse[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [page, setPage] = useState(1);

  const activeApplications = appliedData.filter(
    (application) => !application.archived,
  );
  const visibleApplications = appliedData.filter(
    (application) => application.archived === (activeTab === "archived"),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(visibleApplications.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageApplications = visibleApplications.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const totalApplied = activeApplications.length;
  const shortlistedCount = activeApplications.filter((application) =>
    statusKey(application).includes("shortlist"),
  ).length;
  const interviewCount = activeApplications.filter((application) =>
    statusKey(application).includes("interview"),
  ).length;
  const successCount = activeApplications.filter((application) =>
    ["offered", "accepted", "hired"].includes(statusKey(application)),
  ).length;
  const successRate =
    totalApplied > 0 ? Math.round((successCount / totalApplied) * 100) : 0;

  const stats: ApplicationStat[] = [
    { label: "Total Applied", value: totalApplied },
    { label: "Shortlisted", value: shortlistedCount },
    { label: "Interviews", value: interviewCount },
    { label: "Success Rate", value: `${successRate}%`, highlight: true },
  ];

  const rangeStart = visibleApplications.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(
    startIndex + PAGE_SIZE,
    visibleApplications.length,
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
          />

          <Button
            type="button"
            variant="outline"
            className="h-9 border-white/10 bg-[#101012] text-xs text-white hover:bg-white/5"
            onClick={() => window.print()}
          >
            <Download className="size-3.5" />
            Export PDF
          </Button>
        </div>
      </header>

      <section
        aria-label="Application statistics"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <Card
        id="applications-panel"
        role="tabpanel"
        aria-labelledby={`applications-tab-${activeTab}`}
        className="gap-0 overflow-hidden bg-[#101012] py-0 ring-white/10"
      >
        {/* Mobile: stacked cards keep every detail readable. */}
        <ul className="divide-y divide-white/5 md:hidden">
          {pageApplications.length > 0 ? (
            pageApplications.map((application) => (
              <MobileApplicationCard
                key={application._id}
                application={application}
              />
            ))
          ) : (
            <li>
              <EmptyState />
            </li>
          )}
        </ul>

        {/* Tablet/Desktop: full table. */}
        <div className="hidden md:block">
          {pageApplications.length > 0 ? (
            <ApplicationsTable applications={pageApplications} />
          ) : (
            <EmptyState />
          )}
        </div>

        <CardFooter className="flex-col items-start justify-between gap-3 border-white/5 bg-transparent px-5 py-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            {visibleApplications.length > 0
              ? `Showing ${rangeStart}-${rangeEnd} of ${visibleApplications.length} applications`
              : "No applications to show"}
          </p>

          {visibleApplications.length > 0 ? (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
