"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  BarChart3, 
  Folder, 
  Plus, 
  Layers, 
  CheckCircle2
} from "lucide-react";

import { useGetTasks } from "@/features/tasks/api/use-getAllTasks";
import { useGetProjects } from "@/features/projects/api/use-getAllprojects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTaskModal } from "@/features/tasks/components/createmodel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function TaskAnalyticsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: tasks, isLoading: loadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: loadingProjects } = useGetProjects({ workspaceId });

  const stats = useMemo(() => {
    if (!tasks || !projects) return null;

    const hasTasks = tasks.length > 0;
    
    const projectTaskCounts: Record<string, number> = {};
    projects.forEach((p: any) => {
      projectTaskCounts[p.$id] = 0;
    });
    tasks.forEach((t: any) => {
      if (projectTaskCounts[t.projectId] !== undefined) {
        projectTaskCounts[t.projectId] += 1;
      }
    });

    const projectsRanked = projects
      .map((p: any) => ({
        id: p.$id,
        name: p.name,
        taskCount: projectTaskCounts[p.$id] || 0,
      }))
      .sort((a, b) => b.taskCount - a.taskCount);

    const activeProjectId = selectedProjectId || projectsRanked[0]?.id || null;
    const filteredTasks = tasks.filter((t: any) => t.projectId === activeProjectId);

    const statusCounts = {
      BACKLOG: 0,
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      DONE: 0,
    };

    filteredTasks.forEach((t: any) => {
      if (statusCounts[t.status as keyof typeof statusCounts] !== undefined) {
        statusCounts[t.status as keyof typeof statusCounts] += 1;
      }
    });

    const chartData = [
      { name: "Backlog", count: statusCounts.BACKLOG, color: "#a3a3a3" },
      { name: "To Do", count: statusCounts.TODO, color: "#3b82f6" },
      { name: "In Progress", count: statusCounts.IN_PROGRESS, color: "#f59e0b" },
      { name: "In Review", count: statusCounts.IN_REVIEW, color: "#a855f7" },
      { name: "Done", count: statusCounts.DONE, color: "#10b981" },
    ];

    return {
      hasTasks,
      projectsRanked,
      activeProjectId,
      activeProjectName: projects.find((p: any) => p.$id === activeProjectId)?.name || "Unknown Track",
      chartData,
      totalWorkspaceTasks: tasks.length,
      completedWorkspaceTasks: tasks.filter((t: any) => t.status === "DONE").length
    };
  }, [tasks, projects, selectedProjectId]);

  if (loadingTasks || loadingProjects) {
    return (
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-5">
          <div className="space-y-2 w-full max-w-md">
            <Skeleton className="h-7 w-48 bg-neutral-200 dark:bg-neutral-800" />
            <Skeleton className="h-4 w-full bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <CardContent className="p-5 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800" />
                  <Skeleton className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b border-neutral-100 dark:border-neutral-800/60 space-y-2">
              <Skeleton className="h-5 w-36 bg-neutral-200 dark:bg-neutral-800" />
              <Skeleton className="h-4 w-56 bg-neutral-200 dark:bg-neutral-800" />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-11 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b border-neutral-100 dark:border-neutral-800/60 space-y-2">
              <Skeleton className="h-5 w-40 bg-neutral-200 dark:bg-neutral-800" />
              <Skeleton className="h-4 w-64 bg-neutral-200 dark:bg-neutral-800" />
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-72 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!stats || !stats.hasTasks) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950/40 min-h-[480px] my-auto mx-6 mt-6">
        <div className="h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 shadow-inner">
          <BarChart3 className="h-6 w-6 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Analytics dashboard is currently blind
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
          No actionable tasks found. Populate your developer tracking matrix to construct metric chart visuals.
        </p>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-5 h-10 px-4 bg-neutral-900 hover:opacity-90 dark:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-opacity"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create Task
        </Button>
        <CreateTaskModal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
              <BarChart3 className="h-4.5 w-4.5 stroke-[2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Task Matrix Analytics
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Audit operational densities, workload saturation, and contextual delivery velocities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/50 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Total Tasks</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{stats.totalWorkspaceTasks}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-900/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Completed Segments</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{stats.completedWorkspaceTasks}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/20 flex items-center justify-center text-blue-500">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Active Projects Tracked</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{stats.projectsRanked.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-1 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden max-h-[580px] flex flex-col">
          <CardHeader className="p-5 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-950/20">
            <CardTitle className="text-base font-bold tracking-tight">Project Volume Ranking</CardTitle>
            <CardDescription className="text-xs">Select a project layer to update focus charts dynamically.</CardDescription>
          </CardHeader>
          <CardContent className="p-3 overflow-y-auto no-scrollbar space-y-1.5 flex-1">
            {stats.projectsRanked.map((p) => {
              const isActive = p.id === stats.activeProjectId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border flex items-center justify-between group transition-all",
                    isActive
                      ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-950 font-medium shadow-sm"
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Folder className={cn("h-4 w-4 shrink-0 stroke-[2]", isActive ? "text-current" : "text-neutral-400")} />
                    <span className="text-xs font-semibold tracking-tight truncate">{p.name}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 border",
                    isActive 
                      ? "bg-white/20 dark:bg-neutral-950/10 border-transparent text-white dark:text-neutral-950" 
                      : "bg-neutral-50 dark:bg-neutral-950 border-neutral-100 dark:border-neutral-800 text-neutral-500"
                  )}>
                    {p.taskCount} {p.taskCount === 1 ? "task" : "tasks"}
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b border-neutral-100 dark:border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Status Load Allocation
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-1 mt-0.5">
                  Showing task densities metrics for: 
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 underline decoration-dotted">
                    {stats.activeProjectName}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800/60" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888888" fontSize={11} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} stroke="#888888" fontSize={11} />
                    <Tooltip 
                      cursor={{ fill: "rgba(0,0,0,0.02)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-2.5 rounded-lg shadow-md text-xs font-medium space-y-1">
                              <p className="text-neutral-500 dark:text-neutral-400">{payload[0].name}</p>
                              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                {payload[0].value} {payload[0].value === 1 ? "Task Segment" : "Task Segments"}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                      {stats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}