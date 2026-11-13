import type { ReactNode } from "react";
import {
  BrainCircuit,
  HeartPulse,
  Laptop,
  LayoutTemplate,
  PenTool,
  PiggyBank,
  Plane,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { JobPost } from "../../_components/types";

// The job model does not have a skills field yet, so these tags are static
// placeholders that match the design. Replace them with real job skills later.
const requirementTags = [
  { label: "Figma Expert", icon: PenTool },
  { label: "System Thinking", icon: BrainCircuit },
  { label: "UX/UI Design", icon: LayoutTemplate },
  { label: "Brand Focused", icon: Sparkles },
];

// Benefits are not part of JobForm yet. Add a `benefits` field to the job model
// and render the real values here when it is available.
const benefits = [
  { label: "Full Health & Dental", icon: HeartPulse },
  { label: "Competitive 401k", icon: PiggyBank },
  { label: "Latest Hardware Stipend", icon: Laptop },
  { label: "Unlimited PTO", icon: Plane },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BenefitItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/70"
      >
        <Icon className="size-4" />
      </span>
      {label}
    </div>
  );
}

export function JobContent({ job }: { job: JobPost }) {
  return (
    <div className="space-y-8">
      <Section title="Job Description">
        {/* JobForm has no description field yet. This intro is built from the
            existing fields — replace it with job.description when it is added. */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {job.companyName} is hiring for the {job.jobTitle} position on its{" "}
          {job.jobCategory} team. This is a {job.jobType} role based in{" "}
          {job.jobLocation}.
        </p>
      </Section>

      <Section title="Responsibilities">
        {/* TODO: responsibilities is a single string today. When it becomes a
            string[], map each item to its own <li> element. */}
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-white/30">
          <li className="whitespace-pre-line">
            {job.responsibilities || "No responsibilities listed."}
          </li>
        </ul>
      </Section>

      <Section title="Requirements">
        <div className="flex flex-wrap gap-2">
          {requirementTags.map(({ label, icon: Icon }) => (
            <Badge
              key={label}
              variant="outline"
              className="gap-1.5 border-white/10 bg-white/5 px-2.5 py-1 text-xs font-normal text-muted-foreground"
            >
              <Icon className="size-3.5" />
              {label}
            </Badge>
          ))}
        </div>

        {/* TODO: qualifications is a single string today. When it becomes a
            string[], map each item to its own <li> element. */}
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-white/30">
          <li className="whitespace-pre-line">
            {job.qualifications || "No requirements listed."}
          </li>
        </ul>
      </Section>

      <Section title="Benefits">
        <div className="grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <BenefitItem
              key={benefit.label}
              icon={benefit.icon}
              label={benefit.label}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
