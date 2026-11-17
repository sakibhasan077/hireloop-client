// ============================================================
// job.ts — SERVER ONLY
// Only import this in Server Components, Server Actions, or
// Route Handlers. Never import in "use client" files.
// ============================================================
import { headers } from "next/headers";
import { auth } from "../auth";
import { authFetch } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getJobs = async (query = "") => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`);
  return res.json();
};

export const getSpecificJobData = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`);
  return res.json();
};

// Uses authFetch (server-only) to send authorized requests
export const getApplyJobData = async (query = "") => {
  const url = `${BASE_URL}/applications?${query}`;
  const res = await authFetch(url);
  return res.json();
};

export const getApplyJobDataCount = async (query = "") => {
  const url = `${BASE_URL}/applications/count?${query}`;
  const res = await fetch(url);
  return res.json();
};

// Uses next/headers — server only
export const getUsers = async () => {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "name",
      sortDirection: "desc",
    },
    headers: await headers(),
  });
  return users;
};

export const getIsPremium = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  return res.json();
};
