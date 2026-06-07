"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FolderKanban, ArrowUpRight, Calendar, Layers, Plus } from "lucide-react";

import { useGetProjects } from "@/features/projects/api/use-getAllprojects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ListProjectsProps {
  onOpenProjectModal?: () => void;
}

export default function ListProjects({ onOpenProjectModal }: ListProjectsProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data: projects, isLoading } = useGetProjects({ workspaceId });
  console.log(projects,"projects")

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-36 w-full animate-pulse border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950/40 min-h-[260px]">
        <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 mb-3">
          <FolderKanban className="h-5 w-5 stroke-[1.5]" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          No project instances found
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
          Get started by constructing your first modular target platform track within this workspace ecosystem.
        </p>
        {onOpenProjectModal && (
          <Button
            onClick={onOpenProjectModal}
            className="mt-4 h-9 px-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-xs font-medium rounded-lg flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            New Project
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project: any) => {
        const projectHref = `/workspace/${workspaceId}/projects/${project.$id}`;
        
        return (
          <Link key={project.$id} href={projectHref} className="group block">
            <Card className="h-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5">
              <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between space-y-0 gap-4">
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase shrink-0">
                      {project.name.charAt(0)}
                    </div>
                    <CardTitle className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                      {project.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500 truncate pt-0.5">
                    ID: {project.$id}
                  </CardDescription>
                </div>
                
                <div className="h-7 w-7 rounded-lg border border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800 transition-all shrink-0">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 border-t border-neutral-50 dark:border-neutral-800/30 mt-4 bg-neutral-50/30 dark:bg-neutral-950/20 rounded-b-xl py-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                  <span>
                    {project.$createdAt 
                      ? new Date(project.$createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                      : "Recent Track"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <Layers className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                  <span className="text-neutral-400 font-normal">Tracked Layer</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}