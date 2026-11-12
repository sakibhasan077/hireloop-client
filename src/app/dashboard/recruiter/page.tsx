import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Dashboard — HireLoop",
  description:
    "Manage your job posts, review applicants, and keep your hiring pipeline moving.",
};

const RecruiterDashboardPage = () => {
  return (
    <div className="font-inter min-h-screen bg-[#09090b] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Recruiter Dashboard
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Manage your job posts, review applicants, and keep your hiring
          pipeline moving.
        </p>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
