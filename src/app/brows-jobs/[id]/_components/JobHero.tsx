"use client";

import { BadgeCheck, Bookmark, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JobLogo } from "../../_components/JobLogo";
import type { JobPost } from "../../_components/types";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { applyToAJob } from "@/lib/actions/jobs";
import { getApplyJobData } from "@/lib/api/job";

export interface IJobApplication {
  jobId: string;
  userId: string;
  userEmail: string;
  jobTitle: string;
  companyName: string;
  jobType: string;
  remote: boolean;
  jobLocation: string;
  minSalary: string;
  maxSalary: string;
  salaryFrequency: string;
  deadline: string;
  appliedAt: string;
  status: string;
  archived: boolean;
}

export interface IJobApplicationResponse extends IJobApplication {
  _id: string;
}

export function JobHero({ job }: { job: JobPost }) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const handleApply = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/brows-jobs/${job._id}`);
      return;
    } else if (user.role === "seeker") {
      const application:IJobApplication = {
        jobId: job._id,
        userId: user.id,
        userEmail: user.email,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        jobType: job.jobType,
        remote: job.remote,
        jobLocation: job.jobLocation,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        salaryFrequency: job.frequency,
        deadline: job.applicationDeadline,
        appliedAt: new Date().toISOString(),
        status: job.status,
        archived: false,
      };
      const userJobData:IJobApplicationResponse[] = await getApplyJobData(`userId=${user.id}`)
      const isFindUserId = userJobData.find(item => item.jobId === application.jobId)
      if(isFindUserId){
        toast.error("You have already applied for this job");
        return;
      }
      const result = await applyToAJob(application);
      if (result.insertedId) {
        toast.success("Application submitted successfully");
        router.push("/brows-jobs");
      }
    } else {
      toast.error("User not a Job Seeker");
    }
  };
  return (
    <Card className="gap-0 bg-[#121214] p-4 ring-white/10 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <JobLogo category={job.jobCategory} />

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight wrap-break-words text-white sm:text-2xl">
              {job.jobTitle}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4 shrink-0" />
                {job.companyName}
              </span>

              {/* TODO: show this badge only when the API returns a verified flag for the company. */}
              <Badge
                variant="outline"
                className="gap-1 border-transparent bg-emerald-500/10 px-2 text-[11px] font-medium text-emerald-400"
              >
                <BadgeCheck className="size-3" />
                Verified Employer
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          {/* TODO: toggle save/unsave for the signed-in user. */}
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Save job"
            className="border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
          >
            <Bookmark />
          </Button>

          {/* TODO: open the application form, or send guests to sign-in first. */}
          <Button
            onClick={handleApply}
            type="button"
            className="h-9 flex-1 bg-white px-5 text-sm font-medium text-black hover:bg-white/90 sm:flex-none"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
