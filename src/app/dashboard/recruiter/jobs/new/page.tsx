import NewJobForm from '@/app/dashboard/_components/NewJobForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "New Job — HireLoop",
  description: "Create a new job posting on HireLoop.",
};
const NewJobPage = () => {
  return (
    <>
      <NewJobForm></NewJobForm>
    </>
  );
};

export default NewJobPage;