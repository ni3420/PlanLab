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
  CheckCircle2, 
  FlameKindling
} from "lucide-react";

import { useGetTasks } from "@/features/tasks/api/use-getAllTasks";
import { useGetProjects } from "@/features/projects/api/use-getAllprojects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// FIX: Corrected filename import path from CreateDirectModel to CreateDirectModal
import CreateDirectModal from "@/features/tasks/components/CreateDirectModel";

export default function WorkSpaceAnalytics() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: tasks, isLoading: loadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: loadingProjects } = useGetProjects({ workspaceId });

  const analytics = useMemo(() => {
    if (!tasks || !projects) return null;

    const hasData = tasks.length > 0 || projects.length > 0;
    
    const projectTaskCounts: Record<string, number> = {};
    projects.forEach((p: any) => {
      projectTaskCounts[p.$id] = 0;
    });
    
    tasks.forEach((t: any) => {
      if (projectTaskCounts[t.projectId] !== undefined) {
        projectTaskCounts[t.projectId] += 1;
      }
    });

    const chartData = projects.map((p: any) => ({
      name: p.name,
      count: projectTaskCounts[p.$id] || 0,
    })).sort((a, b) => b.count - a.count);

    const completedTasks = tasks.filter((t: any) => t.status === "DONE").length;
    const inProgressTasks = tasks.filter((t: any) => t.status === "IN_PROGRESS").length;

    return {
      hasData,
      chartData,
      totalTasks: tasks.length,
      completedTasks,
      inProgressTasks,
      totalProjects: projects.length
    };
  }, [tasks, projects]);

  if (loadingTasks || loadingProjects) {
    return (
      <div className="space-y-6 w-full p-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-5">
          <div className="space-y-2 w-full max-w-md">
            <Skeleton className="h-7 w-48 bg-neutral-200 dark:bg-neutral-800" />
            <Skeleton className="h-4 w-full bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <Skeleton className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 shrink-0 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
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

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-5 border-b border-neutral-100 dark:border-neutral-800/60 space-y-2">
            <Skeleton className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800" />
            <Skeleton className="h-4 w-96 bg-neutral-200 dark:bg-neutral-800" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-80 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics || !analytics.hasData) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950/40 min-h-[440px] my-auto">
        <div className="h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 shadow-inner">
          <BarChart3 className="h-6 w-6 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Workspace matrix is completely static
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
          No projects or structural tracking modules indexed yet within this container block instance.
        </p>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-5 h-10 px-4 bg-neutral-900 hover:opacity-90 dark:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-opacity"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Assign Direct Task
        </Button>
        
        {/* Render modal inside empty view state condition */}
        <CreateDirectModal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
              <BarChart3 className="h-4.5 w-4.5 stroke-[2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Workspace Analytics
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            A real-time overview analyzing total development pipelines, sprint logs, and project velocity scopes.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10 px-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Assign Direct Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/50 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Total Tracks</p>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{analytics.totalProjects} Projects</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/50 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Total Footprint</p>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{analytics.totalTasks} Task Units</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100/30 dark:border-amber-900/20 flex items-center justify-center text-amber-500">
              <FlameKindling className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Active Sprints</p>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{analytics.inProgressTasks} In Progress</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-900/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Closed Deliveries</p>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{analytics.completedTasks} Completed</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="p-5 border-b border-neutral-100 dark:border-neutral-800/60">
          <CardTitle className="text-base font-bold tracking-tight">Project Volume Load Balance</CardTitle>
          <CardDescription className="text-xs">Aggregated view demonstrating total task deployment volume assigned per unique project context track.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800/60" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888888" fontSize={11} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} stroke="#888888" fontSize={11} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-2.5 rounded-lg shadow-md text-xs font-medium space-y-0.5">
                          <p className="text-neutral-500 dark:text-neutral-400 font-semibold">{payload[0].payload.name}</p>
                          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            {payload[0].value} {payload[0].value === 1 ? "Task Module" : "Task Modules"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {analytics.chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" opacity={0.85} className="fill-blue-500 dark:fill-blue-600" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Render modal inside normal chart state layout boundary */}
      <CreateDirectModal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
}