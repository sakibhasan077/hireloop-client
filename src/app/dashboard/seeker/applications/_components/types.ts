export interface IJobApplication {
  jobId: string;
  userId: string;
  userEmail: string;
  jobTitle: string;
  companyName: string;
  jobType: string;
  remote: boolean;
  jobLocation: string;
  minSalary: string;
  maxSalary: string;
  salaryFrequency: string;
  deadline: string;
  appliedAt: string;
  status: string;
  archived: boolean;
}

export interface IJobApplicationResponse extends IJobApplication {
  _id: string;
}
