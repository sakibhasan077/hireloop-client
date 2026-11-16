import { requireRole } from "@/lib/core/server";

const RecruterDashboardLayoutPage = async ({children}:{ children: React.ReactNode }) =>{
    await requireRole("recruiter")
    return children;
}

export default RecruterDashboardLayoutPage;