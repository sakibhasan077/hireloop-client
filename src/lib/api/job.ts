import { headers } from "next/headers";
import { auth } from "../auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getJobs = async (query = "") => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`);
  return res.json();
};

// get specific data
export const getSpecificJobData = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`);
  return res.json();
};

// application api
// get
export const getApplyJobData = async (query = "") => {
  const url = `${BASE_URL}/applications?${query}`;
  const res = await fetch(url);
  return res.json();
};
// count application
export const getApplyJobDataCount = async (query = "") => {
  const url = `${BASE_URL}/applications/count?${query}`;
  const res = await fetch(url);
  return res.json();
};

// user related apis
export const getUsers = async () => {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "name", // The field to sort by.
      sortDirection: "desc", // The direction to sort by.
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });
  return users;
};

export const getIsPremium = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  return res.json();
};
