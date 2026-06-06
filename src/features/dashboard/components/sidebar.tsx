"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Layers, 
  CheckSquare, 
  Users, 
  Settings,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { CreateWorkspaceModal } from "@/features/workspace/components/createworkspacemodel";

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  
  const workspaceId = params.workspaceId as string;

  const routes = workspaceId ? [
    { label: "Dashboard", icon: LayoutDashboard, href: `/workspace/${workspaceId}` },
    { label: "Projects", icon: FolderKanban, href: `/workspace/${workspaceId}/projects` },
    { label: "Epics", icon: Layers, href: `/workspace/${workspaceId}/epics` },
    { label: "Tasks", icon: CheckSquare, href: `/workspace/${workspaceId}/tasks` },
    { label: "Members", icon: Users, href: `/workspace/${workspaceId}/members` },
    { label: "Settings", icon: Settings, href: `/workspace/${workspaceId}/settings` },
  ] : [];

  return (
    <>
      <aside className={cn("flex h-full w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4", className)}>
        <div className="flex h-12 items-center gap-2 px-2">
          <div className="h-7 w-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <span className="text-xs font-bold text-white">pL</span>
          </div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">planLab</span>
        </div>

        <div className="mt-4">
          <WorkspaceSwitcher onOpenModal={() => setIsModalOpen(true)} />
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {workspaceId ? (
            routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                  )}
                >
                  <route.icon className="h-4 w-4 shrink-0" />
                  {route.label}
                </Link>
              );
            })
          ) : (
            <div className="p-4 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 text-center flex flex-col items-center justify-center gap-2 mt-4">
              <FolderOpen className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
              <p className="text-xs text-neutral-400 font-medium">
                Select a workspace to view module pathways.
              </p>
            </div>
          )}
        </nav>
      </aside>

      <CreateWorkspaceModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}