"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  Dot,
  Laptop,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createJobs } from "@/lib/actions/jobs";

const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Operations",
  "Other",
];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const FREQUENCIES = ["per hour", "per day", "per month", "per year"];

export const JOB_STATUSES = ["Active", "Paused", "Draft", "Expired"] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export type JobForm = {
  jobTitle: string;
  companyName: string;
  jobCategory: string;
  jobType: string;
  status: JobStatus;
  remote: boolean;
  jobLocation: string;
  applicationDeadline: string;
  minSalary: string;
  maxSalary: string;
  frequency: string;
  responsibilities: string;
  qualifications: string;
};

const initialForm: JobForm = {
  jobTitle: "",
  companyName: "",
  jobCategory: "",
  jobType: "Full-time",
  status: "Active",
  remote: false,
  jobLocation: "",
  applicationDeadline: "",
  minSalary: "",
  maxSalary: "",
  frequency: "per hour",
  responsibilities: "",
  qualifications: "",
};

function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-1 border-b border-white/10 pb-3">
      <span className="flex items-center justify-center text-sm font-semibold ">
      <Dot className="text-[#5C53FE] text-[30px]"></Dot>
        {step}.
      </span>
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  );
}

// star mark for required fields
function RequiredMark() {
  return <span className="text-[#5C53FE]">*</span>;
}

const NewJobForm = () => {
  const [form, setForm] = useState<JobForm>(initialForm);

  const setField = <K extends keyof JobForm>(key: K, value: JobForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.jobTitle || !form.jobCategory || !form.jobLocation || !form.applicationDeadline) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // The collected data is a plain object — ready to send to an API.
    const jobData = {...form}
    const result = await createJobs(jobData)
    if(result.insertedId){
      toast.success(`"${form.jobTitle}" has been published.`);
    }
    setForm(initialForm);

  };

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 sm:px-8">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-6">
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
                <span>Manage Jobs</span>
                <ChevronRight className="size-3.5 shrink-0" />
                <span>Create New Listing</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Post a New Job</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the position specifications to attract qualified talent across our
                network.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#5C53FE] text-white hover:bg-[#5C53FE]/90 sm:w-auto sm:shrink-0"
          >
            Publish Job <ArrowRight className="ml-1 size-4" />
          </Button>
        </header>

        {/* 1. Basic Information */}
        <Card className="bg-[#101012] ring-white/10">
          <CardContent className="space-y-5">
            <SectionHeading step={1} title="Basic Information" />

            <div className="space-y-2">
              <Label htmlFor="jobTitle">
                Job Title <RequiredMark />
              </Label>
              <Input
                id="jobTitle"
                required
                placeholder="Frontend Developer"
                value={form.jobTitle}
                onChange={(e) => setField("jobTitle", e.target.value)}
                className="h-10 bg-white/3"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="HireLoop Network"
                    value={form.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    className="h-10 bg-white/3 pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobCategory">
                  Job Category <RequiredMark />
                </Label>
                <Select
                  value={form.jobCategory}
                  onValueChange={(value) => setField("jobCategory", value ?? "")}
                >
                  <SelectTrigger id="jobCategory" className="h-10 w-full bg-white/3">
                    <SelectValue placeholder="Engineering & Tech" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Job Type <RequiredMark />
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={form.jobType === type}
                    onClick={() => setField("jobType", type)}
                    className={cn(
                      "h-10 rounded-lg border text-sm font-medium transition-colors",
                      form.jobType === type
                        ? "border-[#5C53FE] bg-[#5C53FE]/10 text-[#5C53FE]"
                        : "border-white/10 text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Job Status <RequiredMark />
              </Label>
              <Select
                value={form.status}
                onValueChange={(value) => setField("status", (value ?? "Active") as JobStatus)}
              >
                <SelectTrigger id="status" className="h-10 w-full bg-white/3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 2. Location, Compensation & Timeline */}
        <Card className="bg-[#101012] ring-white/10">
          <CardContent className="space-y-5">
            <SectionHeading step={2} title="Location, Compensation & Timeline" />

            <div className="flex items-center justify-between gap-4 rounded-lg border border-[#5C53FE]/30 bg-[#5C53FE]/5 p-3.5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-[#5C53FE]">
                  <Laptop className="size-4" />
                </span>
                <div>
                  <Label htmlFor="remote" className="text-sm font-medium">
                    Remote Work Allowed
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Position can be performed outside a fixed office.
                  </p>
                </div>
              </div>
              <Switch
                id="remote"
                checked={form.remote}
                onCheckedChange={(checked) => setField("remote", checked)}
                className="data-checked:bg-[#5C53FE]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobLocation">
                  Job Location <RequiredMark />
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="jobLocation"
                    required
                    placeholder="New York, USA"
                    value={form.jobLocation}
                    onChange={(e) => setField("jobLocation", e.target.value)}
                    className="h-10 bg-white/3 pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">
                  Application Deadline <RequiredMark />
                </Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="applicationDeadline"
                    type="date"
                    required
                    value={form.applicationDeadline}
                    onChange={(e) => setField("applicationDeadline", e.target.value)}
                    className="h-10 bg-white/3 pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="minSalary">Min Salary / Rate</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                  <Input
                    id="minSalary"
                    type="number"
                    min={0}
                    placeholder="25"
                    value={form.minSalary}
                    onChange={(e) => setField("minSalary", e.target.value)}
                    className="h-10 bg-white/3 pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSalary">Max Salary / Rate</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                  <Input
                    id="maxSalary"
                    type="number"
                    min={0}
                    placeholder="40"
                    value={form.maxSalary}
                    onChange={(e) => setField("maxSalary", e.target.value)}
                    className="h-10 bg-white/3 pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(value) => setField("frequency", value ?? "per hour")}
                >
                  <SelectTrigger id="frequency" className="h-10 w-full bg-white/3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Responsibilities & Requirements */}
        <Card className="bg-[#101012] ring-white/10">
          <CardContent className="space-y-5">
            <SectionHeading step={3} title="Responsibilities & Requirements" />

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Key Responsibilities</Label>
              <Textarea
                id="responsibilities"
                rows={4}
                placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences..."
                value={form.responsibilities}
                onChange={(e) => setField("responsibilities", e.target.value)}
                className="bg-white/3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications & Requirements</Label>
              <Textarea
                id="qualifications"
                rows={4}
                placeholder={
                  "3+ years of experience with React, TypeScript, and modern state architectures..."
                }
                value={form.qualifications}
                onChange={(e) => setField("qualifications", e.target.value)}
                className="bg-white/3"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
};

export default NewJobForm;
