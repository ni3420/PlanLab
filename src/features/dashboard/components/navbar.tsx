"use client";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/features/dashboard/components/toggle-button";
import UserButton from "@/features/auth/components/userButton";

export function DashboardNavbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        
        {/* Mobile Logo Brand */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white dark:text-neutral-950">pL</span>
          </div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight text-sm">
            planLab
          </span>
        </div>
        
        {/* Desktop Context Path Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-1.5 text-sm">
          <span className="text-neutral-400">Workspace</span>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Overview</span>
        </div>
      </div>

      {/* Control Actions Frame */}
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserButton />
      </div>
    </header>
  );
}