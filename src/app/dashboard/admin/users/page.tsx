import type { Metadata } from "next";
import { getUsers } from "@/lib/api/job";
import { UsersManagement } from "./_components/UsersManagement";

export const metadata: Metadata = {
  title: "User Management — HireLoop",
  description: "Review, filter, and manage platform access for all users.",
};

const AdminUserPage = async () => {
  const users = await getUsers();

  // Extract array of users from Better-Auth response
  const userList = Array.isArray(users)
    ? users
    : users?.users && Array.isArray(users.users)
      ? users.users
      : [];

  return (
    <main className="font-inter min-h-screen bg-[#09090b] px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <UsersManagement initialUsers={userList} />
      </div>
    </main>
  );
};

export default AdminUserPage;
