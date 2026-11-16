import { getUsers } from '@/lib/api/job';
import React from 'react';

const AdminUserPage = async () => {
  const users = await getUsers();
  console.log("Users", users);
  return (
    <div>
      Admin Users page
    </div>
  );
};

export default AdminUserPage;