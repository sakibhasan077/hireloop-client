import type { Metadata } from "next";
import Link from "next/link";
import { getApplyJobData, getSpecificJobData } from "@/lib/api/job";
import { ApplicationRow, type Application } from "./_components/ApplicationRow";

export const metadata: Metadata = {
  title: "Job Applications — HireLoop",
  description:
    "Review applicants for your job posting and update their hiring status.",
};

const ApplicationPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;

  // Fetch applications for this job and job info
  const applications = await getApplyJobData(`jobId=${jobId}`);
  const job = await getSpecificJobData(jobId);

  const jobTitle = job?.jobTitle || "Real Authentic Job";
  const companyName = job?.companyName || "AuthBD";

  return (
    <main className="font-inter min-h-screen bg-[#09090b] px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* 1. Breadcrumbs and Page Title */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Link
              href="/dashboard/recruiter/jobs"
              className="hover:text-white transition-colors"
            >
              Manage Jobs
            </Link>
            <span className="text-zinc-600">/</span>
            <Link
              href={`/dashboard/recruiter/jobs/${jobId}`}
              className="text-zinc-300 hover:text-white transition-colors font-medium"
            >
              {jobTitle}
            </Link>
            <span className="text-zinc-600">/</span>
            <span>Applications</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Job Applications
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Review applicants for {jobTitle} at {companyName} and update their hiring status.
          </p>
        </div>

        {/* 2. Table matching the picture (Zero scroll behaviour) */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11]">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="py-3.5 pl-6 pr-4 text-xs font-medium text-zinc-400">
                  Applicant
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-zinc-400">
                  Applied
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-zinc-400">
                  Status
                </th>
                <th className="pl-4 pr-6 py-3.5 text-xs font-medium text-zinc-400">
                  Update status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {applications && applications.length > 0 ? (
                applications.map((app: Application) => (
                  <ApplicationRow key={app._id} app={app} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-sm text-zinc-400"
                  >
                    No applications found for this job.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ApplicationPage;
