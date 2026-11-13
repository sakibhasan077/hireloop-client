import { Banknote, Clock, MapPin, Users, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { JobPost } from "../../_components/types";

const frequencySuffix: Record<string, string> = {
  "per hour": "/hr",
  "per day": "/day",
  "per month": "/mo",
  "per year": "/yr",
};

/** Turns the stored salary strings into a short label like "€140k - €160k /yr". */
function formatMoney(value: string) {
  const amount = Number(value);

  if (!value.trim() || Number.isNaN(amount)) {
    return null;
  }

  return amount >= 1000
    ? `€${Math.round(amount / 1000)}k`
    : `€${amount.toLocaleString("en-US")}`;
}

function formatSalary(job: JobPost) {
  const min = formatMoney(job.minSalary);
  const max = formatMoney(job.maxSalary);

  if (!min && !max) {
    return "Not disclosed";
  }

  const range = min && max ? `${min} - ${max}` : (min ?? max);
  const suffix = frequencySuffix[job.frequency] ?? "";

  return `${range}${suffix ? ` ${suffix}` : ""}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="gap-0 bg-[#121214] p-3.5 ring-white/10">
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-md bg-white/5 text-white/60"
      >
        <Icon className="size-3.5" />
      </span>

      <p className="mt-2.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold break-words text-white">
        {value}
      </p>
    </Card>
  );
}

export function JobStats({ job }: { job: JobPost }) {
  const location = job.remote
    ? `${job.jobLocation} (Remote)`
    : job.jobLocation;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard icon={Banknote} label="Salary" value={formatSalary(job)} />
      <StatCard icon={MapPin} label="Location" value={location} />
      <StatCard icon={Clock} label="Job Type" value={job.jobType} />
      <StatCard
        icon={Users}
        label="Applicants"
        value={`${job.applicants ?? 0} Candidates`}
      />
    </div>
  );
}
