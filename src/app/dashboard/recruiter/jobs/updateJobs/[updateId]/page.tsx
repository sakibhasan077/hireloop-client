import type { Metadata } from "next";
import { notFound } from "next/navigation";

import UpdateJobForm from "@/app/dashboard/_components/UpdateJobForm";
import type { JobPost } from "@/app/dashboard/recruiter/jobs/page";
import { getSpecificJobData } from "@/lib/api/job";

export const metadata: Metadata = {
  title: "Update Job — HireLoop",
  description: "Update an existing job posting on HireLoop.",
};

const UpdateJobs = async ({
  params,
}: {
  params: Promise<{ updateId: string }>;
}) => {
  const { updateId } = await params;
  const jobData = (await getSpecificJobData(updateId)) as JobPost | null;

  if (!jobData || !jobData.jobTitle) {
    notFound();
  }

  return (
    <div className="font-inter">
      <UpdateJobForm job={jobData} />
    </div>
  );
};

export default UpdateJobs;
