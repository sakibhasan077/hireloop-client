"use client"
import { Trash2, Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { JobPost } from "../recruiter/jobs/page";
import { deleteJobs } from "@/lib/actions/jobs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteJobDialog({ job }: { job: JobPost }) {
  const router = useRouter()
  const handleDeleteJobs = async () =>{
    const result = await deleteJobs(job._id)
    console.log(result);
    toast.success("Job deleted successfully")
    router.push("/dashboard/recruiter/jobs")
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-red-400"
            aria-label={`Delete ${job.jobTitle}`}
          > <Trash2 /> </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Job?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this job? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteJobs} variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
