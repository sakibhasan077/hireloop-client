import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSpecificJobData } from "@/lib/api/job";

import type { JobPost } from "../_components/types";
import { CompanyOverview } from "./_components/CompanyOverview";
import { JobContent } from "./_components/JobContent";
import { JobHero } from "./_components/JobHero";
import { JobStats } from "./_components/JobStats";

export const metadata: Metadata = {
  title: "Job Details — HireLoop",
  description: "View the full details of this job posting on HireLoop.",
};

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // Fetch the job that belongs to the id in the URL.
  const job = (await getSpecificJobData(id)) as JobPost | null;

  // If the API has no job for this id, show the 404 page.
  if (!job || !job.jobTitle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#09090b] pt-20 pb-16 font-inter text-white sm:pt-24">
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 sm:space-y-5 sm:px-6 lg:px-8">
        <JobHero job={job} />
        <JobStats job={job} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <JobContent job={job} />
          <CompanyOverview job={job} />
        </div>
      </div>
    </main>
  );
};

export default JobDetailsPage;
