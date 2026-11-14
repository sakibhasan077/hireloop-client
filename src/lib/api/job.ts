const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getJobs = async (query="") =>{
  const res = await fetch(`${BASE_URL}/jobs?${query}`)
  return res.json();
}

// get specific data
export const getSpecificJobData = async (jobId:string) =>{
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`);
  return res.json();
}


// application api
// get
export const getApplyJobData = async (query="") =>{
  const url = `${BASE_URL}/applications?${query}`;
  const res = await fetch(url);
  return res.json();
}