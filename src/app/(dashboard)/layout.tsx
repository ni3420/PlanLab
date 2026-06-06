"use client"
import { DashboardSidebar } from "@/features/dashboard/components/sidebar";
import { DashboardNavbar } from "@/features/dashboard/components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50/50 dark:bg-neutral-900/20">
      <DashboardSidebar className="hidden lg:flex fixed inset-y-0 left-0 " />
      
      <div className="flex flex-col flex-1 lg:pl-64">
        <DashboardNavbar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}