"use client";

import { useParams } from "next/navigation";
import { 
  Calendar, 
  Folder, 
  Loader2, 
  ClipboardList, 
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

import { TaskStatusEnum } from "../Schema";
import { useGetTasks } from "@/features/tasks/api/use-getAllTasks";
import { useGetProjects } from "@/features/projects/api/use-getAllprojects";
import { useGetMembers } from "@/features/member/api/use-getmembers";
import { useDeleteTask } from "@/features/tasks/api/use-deleteTask";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TaskStatus = typeof TaskStatusEnum._type;

const STATUS_BADGES: Record<TaskStatus, string> = {
  BACKLOG: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-700/50",
  TODO: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
  IN_PROGRESS: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
  IN_REVIEW: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
  DONE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

export default function TaskTable() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data: tasks, isLoading: loadingTasks } = useGetTasks({ workspaceId });
  const { data: projects } = useGetProjects({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });
  const { mutate: deleteTask } = useDeleteTask();

  const handleDelete = (taskId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this task parameter?")) {
      deleteTask({ param: { taskId } });
    }
  };

  if (loadingTasks) {
    return (
      <div className="flex h-[30vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
          <p className="text-xs text-neutral-400 font-medium">Fetching table parameters...</p>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950/40 min-h-[240px]">
        <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 mb-3">
          <ClipboardList className="h-5 w-5 stroke-[1.5]" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">No indexed task units</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
          Your documentation matrix is currently empty. Add tasks to see them inside this spreadsheet view.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto no-scrollbar">
          <Table>
            <TableHeader className="bg-neutral-50/50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 w-[40%] pl-6">
                  Task Name
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 w-[15%]">
                  Status
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 w-[15%]">
                  Project Track
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 w-[15%]">
                  Assignee
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 w-[15%]">
                  Due Date
                </TableHead>
                <TableHead className="h-11 w-10 pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {tasks.map((task: any) => {
                const targetProject = projects?.find((p: any) => p.$id === task.projectId);
                const targetAssignee = members?.documents?.find((m: any) => m.userId === task.assigneeId);
                const assigneeName = targetAssignee ? (targetAssignee.name || targetAssignee.email) : "Unassigned";

                return (
                  <TableRow 
                    key={task.$id} 
                    className="border-none hover:bg-neutral-50/40 dark:hover:bg-neutral-950/30 transition-colors group"
                  >
                    {/* Name column cell */}
                    <TableCell className="py-3.5 font-medium text-neutral-900 dark:text-neutral-100 pl-6">
                      <div className="flex flex-col min-w-0 max-w-[400px]">
                        <span className="truncate text-sm font-semibold tracking-tight">{task.name}</span>
                        {task.description && (
                          <span className="truncate text-xs font-normal text-neutral-400 dark:text-neutral-500 mt-0.5">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status column cell */}
                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${STATUS_BADGES[task.status as TaskStatus] || STATUS_BADGES.TODO}`}>
                        {STATUS_LABELS[task.status as TaskStatus] || task.status}
                      </span>
                    </TableCell>

                    {/* Project tracker cell */}
                    <TableCell className="py-3.5 text-neutral-500 dark:text-neutral-400 text-xs">
                      {targetProject ? (
                        <div className="flex items-center gap-1.5 max-w-[150px]">
                          <Folder className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5] shrink-0" />
                          <span className="truncate font-medium">{targetProject.name}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-600 italic">No project</span>
                      )}
                    </TableCell>

                    {/* Assignee identity cell */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2 max-w-[150px]">
                        <div className="h-5 w-5 rounded-full bg-neutral-900 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[9px] font-bold text-white uppercase shrink-0">
                          {assigneeName.charAt(0)}
                        </div>
                        <span className="truncate text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          {assigneeName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Due Date tracking layout cell */}
                    <TableCell className="py-3.5 text-neutral-500 dark:text-neutral-400 text-xs font-medium">
                      {task.dueDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                          <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-600">—</span>
                      )}
                    </TableCell>

                    {/* Actions Context Row Dropdown Menu control block */}
                    <TableCell className="py-3.5 text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-7 w-7 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 rounded-md data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-800"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-36 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-1 rounded-lg"
                        >
                          <DropdownMenuItem className="flex items-center gap-2 text-xs font-medium px-2 py-1.5 rounded-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            <Eye className="h-3.5 w-3.5 text-neutral-400" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(task.$id)}
                            className="flex items-center gap-2 text-xs font-medium px-2 py-1.5 rounded-md cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}