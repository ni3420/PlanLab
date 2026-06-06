"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileSidebar } from "@/components/mobile-sidebar";

export function DashboardNavbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        
        <div className="flex lg:hidden items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white dark:text-neutral-950">pL</span>
          </div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight text-sm">
            planLab
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-1.5 text-sm">
          <span className="text-neutral-400">Workspace</span>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Overview</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
          <Bell className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
        </Button>

        <Avatar className="h-8 w-8 cursor-pointer border border-neutral-200 dark:border-neutral-800">
          <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            KU
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}