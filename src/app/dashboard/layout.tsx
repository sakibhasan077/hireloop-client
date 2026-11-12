import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./_components/DashboardSidebar";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
   return (
    <SidebarProvider>
      <DashboardSidebar></DashboardSidebar>
      <main className="flex min-w-0 flex-1 flex-col">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
};

export default DashboardLayout;