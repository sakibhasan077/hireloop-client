import { requireRole } from "@/lib/core/server";

const SeekerDashboardLayoutPage = async ({children}:{ children: React.ReactNode }) =>{
    await requireRole("seeker")
    return children;
}

export default SeekerDashboardLayoutPage;