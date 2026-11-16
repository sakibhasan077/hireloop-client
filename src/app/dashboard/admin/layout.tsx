import { requireRole } from "@/lib/core/server";

const AdminDashboardLayout = async ({children}:{ children: React.ReactNode }) =>{
    await requireRole("admin")
    return children;
}

export default AdminDashboardLayout;