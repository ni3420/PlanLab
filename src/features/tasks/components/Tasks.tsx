"use client";

import { useState } from "react";
import { Kanban, Table2, Plus, CheckSquare } from "lucide-react";

import KanbanBoard from "@/features/tasks/components/kanbanBoard";
import TaskTable from "@/features/tasks/components/tableData";
import { CreateTaskModal } from "@/features/tasks/components/createmodel"; // Ensure this modal matches your wrapper filename
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TaskViewMode = "kanban" | "table";

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<TaskViewMode>("kanban");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="h-full flex flex-col space-y-6 p-6">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
                <CheckSquare className="h-4.5 w-4.5 stroke-[2]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Workspace Tasks
              </h1>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Coordinate tracking modules, monitor backlogs, and organize execution sprints.
            </p>
          </div>

          {/* Create Task Action Control Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            New Task
          </Button>
        </div>

        {/* View Switcher Controls Section */}
        <div className="flex items-center justify-between bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/60 p-1 rounded-xl max-w-[240px]">
          <button
            onClick={() => setViewMode("kanban")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all",
              viewMode === "kanban"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            <Kanban className="h-3.5 w-3.5" />
            Kanban
          </button>
          
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all",
              viewMode === "table"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            <Table2 className="h-3.5 w-3.5" />
            Spreadsheet
          </button>
        </div>

        {/* Dynamic Display Rendering Matrix */}
        <div className="flex-1 w-full overflow-hidden">
          {viewMode === "kanban" ? (
            <KanbanBoard onOpenCreateTaskModal={() => setIsCreateModalOpen(true)} />
          ) : (
            <TaskTable />
          )}
        </div>
      </div>

      {/* Creation Dialog Modal Component Frame */}
      <CreateTaskModal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  );
}