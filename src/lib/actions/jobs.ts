import { JobForm } from "@/app/dashboard/_components/NewJobForm";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
// post
export const createJobs = async (data:JobForm) => {
  const res = await fetch(`${BASE_URL}/jobs`,{
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

//delete
export const deleteJobs = async (jobId:string) =>{
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`,{
    method:"DELETE"
  });
  return res.json();
}