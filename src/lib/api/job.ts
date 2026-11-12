const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getJobs = async () =>{
  const res = await fetch(`${BASE_URL}/jobs`)
  return res.json();
}

// get specific data
export const getSpecificJobData = async (jobId:string) =>{
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`);
  return res.json();
}