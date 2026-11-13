import type { JobForm, JobStatus } from "@/app/dashboard/_components/NewJobForm";

// Re-export the shared job types so browse-jobs components import from one place.
export type { JobForm, JobStatus };

/**
 * A job post exactly as it comes back from the API.
 * It is the form data plus the fields the database adds.
 */
export type JobPost = JobForm & {
  _id: string;
  postedAt: string;
};
