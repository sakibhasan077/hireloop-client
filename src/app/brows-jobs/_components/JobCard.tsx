import { Bookmark, Wifi } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { JobLogo } from "./JobLogo";
import type { JobPost } from "./types";

const frequencySuffix: Record<string, string> = {
  "per hour": "/hr",
  "per day": "/day",
  "per month": "/mo",
  "per year": "/yr",
};

/**
 * Purely presentational helpers that turn the stored salary strings into a
 * compact label like "$120k - $150k /yr".
 */
function formatAmount(value: string) {
  const amount = Number(value);

  if (!value.trim() || Number.isNaN(amount)) {
    return null;
  }

  return amount >= 1000
    ? `$${Math.round(amount / 1000)}k`
    : `$${amount.toLocaleString("en-US")}`;
}

function formatSalary(job: JobPost) {
  const min = formatAmount(job.minSalary);
  const max = formatAmount(job.maxSalary);

  if (!min && !max) {
    return null;
  }

  const range = min && max ? `${min} - ${max}` : min ?? max;
  const suffix = frequencySuffix[job.frequency] ?? "";

  return `${range}${suffix ? ` ${suffix}` : ""}`;
}

export function JobCard({ job }: { job: JobPost }) {
  const salary = formatSalary(job);

  return (
    <article className="group relative rounded-xl border border-white/10 bg-[#121214] p-4 transition-colors hover:border-white/20 hover:bg-[#161618]">
      {/* Bookmark is visual only for now. Connect it to the saved-jobs feature later. */}
      <button
        type="button"
        aria-label={`Save ${job.jobTitle}`}
        className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
      >
        <Bookmark className="size-4" />
      </button>

      <div className="flex items-start gap-3">
        <JobLogo category={job.jobCategory} />

        <div className="min-w-0 flex-1">
          <h3 className="truncate pr-8 text-sm font-semibold text-white sm:text-[15px]">
            {job.jobTitle}
          </h3>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {job.companyName}
            <span className="mx-1.5 text-white/20">•</span>
            {job.jobLocation}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/3 text-[11px] font-normal text-muted-foreground"
            >
              {job.jobCategory}
            </Badge>

            {job.remote ? (
              <Badge
                variant="outline"
                className="border-white/10 bg-white/3 text-[11px] font-normal text-muted-foreground"
              >
                <Wifi />
                Remote
              </Badge>
            ) : null}

            <Badge
              variant="outline"
              className="border-white/10 bg-white/3 text-[11px] font-normal text-muted-foreground"
            >
              {job.jobType}
            </Badge>

            {salary ? (
              <Badge
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-[11px] font-medium text-emerald-400"
              >
                {salary}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
