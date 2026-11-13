import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

import { getJobs } from "@/lib/api/job";

import { JobCard } from "./_components/JobCard";
import { JobFilters } from "./_components/JobFilters";
import { JobSearchBar } from "./_components/JobSearchBar";
import { JobsPagination } from "./_components/JobsPagination";
import type { JobPost } from "./_components/types";

export const metadata: Metadata = {
  title: "Browse Jobs — HireLoop",
  description:
    "Explore curated job openings from top companies and find your next role.",
};

const BrowsJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchOut = await searchParams;
  const querySearch = new URLSearchParams(searchOut as Record<string, string>);
  const query = querySearch.toString();
  const jobData = await getJobs(query);

  // getJobs returns an array of job posts. Fall back to an empty list so the
  // page still renders if the response shape changes.
  const jobs: JobPost[] = Array.isArray(jobData) ? jobData : [];

  return (
    <main className="min-h-screen bg-[#09090b] pt-20 pb-16 font-inter text-white sm:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <li>
              <span className="text-white/70">Public</span>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Browse Jobs</li>
          </ol>
        </nav>

        <JobSearchBar />

        <div className="mt-6 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <JobFilters />

          <section aria-labelledby="job-results-heading" className="min-w-0">
            {/* Results header + sort */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1
                id="job-results-heading"
                className="text-sm font-semibold text-white sm:text-[15px]"
              >
                Found {jobs.length.toLocaleString("en-US")} Professional Jobs
              </h1>

              {/* TODO: read this select and update the query string when sorting is added. */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <label htmlFor="sort-jobs">Sort by:</label>
                <span className="relative">
                  <select
                    id="sort-jobs"
                    defaultValue="newest"
                    className="h-8 appearance-none rounded-md border border-white/10 bg-[#121214] pr-7 pl-2.5 text-xs text-white outline-none transition-colors hover:border-white/20 focus:border-[#5C53FE]/60"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="salary">Highest Salary</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                </span>
              </div>
            </div>

            {jobs.length > 0 ? (
              <div className="flex flex-col gap-2">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-[#121214] px-6 py-14 text-center">
                <p className="text-sm font-medium text-white">No jobs found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try a different search term or clear your filters.
                </p>
              </div>
            )}

            <JobsPagination />
          </section>
        </div>
      </div>
    </main>
  );
};

export default BrowsJobsPage;
