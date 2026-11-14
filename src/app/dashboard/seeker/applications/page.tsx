import type { Metadata } from "next";

import { getApplyJobData } from "@/lib/api/job";

import { ApplicationsView } from "./_components/ApplicationsView";
import type { IJobApplicationResponse } from "./_components/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "My Applications — HireLoop",
  description:
    "Track your job applications, shortlists, interviews, and offers in one place.",
};

const ApplicationsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const appliedData: IJobApplicationResponse[] = await getApplyJobData(`userId=${session?.user.id}`);

  return (
    <main className="font-inter min-h-screen bg-[#09090b] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ApplicationsView appliedData={appliedData} />
      </div>
    </main>
  );
};

export default ApplicationsPage;
