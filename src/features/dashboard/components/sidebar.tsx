"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  Users, 
  Settings,
  FolderOpen,
  Plus,
  FolderKanban
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { CreateWorkspaceModal } from "@/features/workspace/components/createworkspacemodel";
import { useGetProjects } from "@/features/projects/api/use-getAllprojects";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/features/projects/components/creatprojectmodel"; // Ensure this matches your modal wrapper path

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const pathname = usePathname();
  const params = useParams();
  
  const workspaceId = params.workspaceId as string;
  const { data: projects } = useGetProjects({ workspaceId });

  const routes = workspaceId ? [
    { label: "Dashboard", icon: LayoutDashboard, href: `/workspace/${workspaceId}` },
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
          <WorkspaceSwitcher onOpenModal={() => setIsWorkspaceModalOpen(true)} />
        </div>

        <nav className="mt-8 flex-1 flex flex-col justify-between overflow-hidden">
          {workspaceId ? (
            <>
              {/* Top Section: Main Module Navigation Paths */}
              <div className="space-y-1 overflow-y-auto no-scrollbar">
                {routes.map((route) => {
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
                })}
              </div>

              {/* Bottom Section: Dedicated Project Sub-Listing Layout */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex flex-col max-h-[40%] min-h-[150px]">
                <div className="flex items-center justify-between px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  <span>Projects</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsProjectModalOpen(true)}
                    className="h-5 w-5 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                  {projects?.map((project: any) => {
                    const projectHref = `/workspace/${workspaceId}/projects/${project.$id}`;
                    const isProjectActive = pathname === projectHref;

                    return (
                      <Link
                        key={project.$id}
                        href={projectHref}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors group",
                          isProjectActive
                            ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900/50 dark:hover:text-neutral-200"
                        )}
                      >
                        <div className="h-5 w-5 rounded bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-700 dark:text-neutral-400 uppercase shrink-0 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700 transition-colors">
                          {project.name.charAt(0)}
                        </div>
                        <span className="truncate">{project.name}</span>
                      </Link>
                    );
                  })}

                  {projects?.length === 0 && (
                    <div className="flex items-center gap-2 px-3 py-4 text-xs text-neutral-400 font-medium italic border border-dashed border-neutral-100 dark:border-neutral-900 rounded-lg justify-center bg-neutral-50/30 dark:bg-neutral-900/10">
                      <FolderKanban className="h-3.5 w-3.5 stroke-[1.5]" />
                      No active tracks
                    </div>
                  )}
                </div>
              </div>
            </>
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

      <CreateWorkspaceModal isOpen={isWorkspaceModalOpen} onOpenChange={setIsWorkspaceModalOpen} />
      <CreateProjectModal isOpen={isProjectModalOpen} onOpenChange={setIsProjectModalOpen} />
    </>
  );
}