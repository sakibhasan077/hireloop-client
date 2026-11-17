// ============================================================
// job-client.ts — SAFE FOR CLIENT COMPONENTS
// Only plain fetch() calls here — no next/headers, no auth
// import this in "use client" files instead of job.ts
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getApplyJobDataClient = async (query = "") => {
  const url = `${BASE_URL}/applications?${query}`;
  const res = await fetch(url);
  return res.json();
};

export const getApplyJobDataCountClient = async (query = "") => {
  const url = `${BASE_URL}/applications/count?${query}`;
  const res = await fetch(url);
  return res.json();
};

export const getIsPremiumClient = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  return res.json();
};
