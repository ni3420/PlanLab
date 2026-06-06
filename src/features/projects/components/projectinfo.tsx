"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Folder, 
  Settings, 
  Calendar, 
  Hash, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Briefcase
} from "lucide-react";

import { useGetProject } from "@/features/projects/api/use-getproject";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectInfo() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;

  const { data: project, isLoading, error } = useGetProject({ projectId });

  if (isLoading) {
    return (
      <div className="flex h-[40vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          <p className="text-xs text-neutral-400 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-[40vh] w-full items-center justify-center p-6">
        <div className="max-w-md text-center flex flex-col items-center gap-3 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-white dark:bg-neutral-900 shadow-sm">
          <AlertCircle className="h-8 w-8 text-red-500 stroke-[1.5]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Project connection failed
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              The requested track instance could not be retrieved or your membership status has changed.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/workspace/${workspaceId}`)}
            className="h-9 text-xs border-neutral-200 dark:border-neutral-800 mt-2"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/workspace/${workspaceId}`)}
            className="h-8 px-2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 -ml-2 mb-1 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Overview
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 dark:text-neutral-100 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
              {project.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                {project.name}
              </h1>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono tracking-tight">
                Ref: {project.$id}
              </p>
            </div>
          </div>
        </div>

        <Link href={`/workspace/${workspaceId}/projects/${project.$id}/settings`}>
          <Button
            type="button"
            variant="outline"
            className="h-9 text-xs border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
          >
            <Settings className="h-3.5 w-3.5" />
            Project Settings
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100 dark:border-neutral-800/40">
              <Calendar className="h-4 w-4 stroke-[1.5]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Created On</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {project.$createdAt 
                  ? new Date(project.$createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100 dark:border-neutral-800/40">
              <Briefcase className="h-4 w-4 stroke-[1.5]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Parent context</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                Workspace Instance
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100 dark:border-neutral-800/40">
              <Hash className="h-4 w-4 stroke-[1.5]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Tracking Reference</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate font-mono text-xs">
                {project.workspaceId}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-neutral-100 dark:border-neutral-800/60">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-neutral-400" />
            <CardTitle className="text-lg font-semibold tracking-tight">Project Overview</CardTitle>
          </div>
          <CardDescription className="text-xs text-neutral-400">
            Monitor and coordinate tasks, sprint configurations, and development milestones assigned to this workspace pipeline track.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center py-8 border border-dashed border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/30 dark:bg-neutral-950/10 min-h-[160px]">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No modular boards configured</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-xs">
              Epics, Sprints, and Tasks connected to this project node will render directly within this interface dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}