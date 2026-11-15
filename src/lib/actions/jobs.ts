import { IJobApplication } from "@/app/brows-jobs/[id]/_components/JobHero";
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

// update
export const updateJobs = async (updateId:string, updateData:JobForm) =>{
  const res = await fetch(`${BASE_URL}/jobs/${updateId}`,{
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(updateData)
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

// Application Related Api

// post
export const applyToAJob = async (applicationData:IJobApplication) =>{
  const res = await fetch(`${BASE_URL}/applications`,{
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(applicationData)
  });
  return res.json();
}

// update status
export const updateApplicationStatus = async (applicationId: string, data:{status: string}) => {
  console.log({applicationId,data})
  const res = await fetch(`${BASE_URL}/applications/${applicationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


// payment related
export const paymentCheckout = async (sessionId: string) =>{
  const res = await fetch(`${BASE_URL}/payment/checkout-verify`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({sessionId})
  })
  return res.json();
}