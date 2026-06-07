"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Folder, 
  ClipboardList,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

import { TaskStatusEnum,Task } from "../Schema";
import { useGetTasks } from "@/features/tasks/api/use-getAllTasks";
import { useBulkUpdateTasks } from "@/features/tasks/api/use-bulkupdate";
import { useGetProjects } from "@/features/projects/api/use-getAllprojects";
import { useGetMembers } from "@/features/member/api/use-getmembers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import z from "zod";

type TaskStatus = z.infer<typeof TaskStatusEnum>

const COLUMNS: { label: string; value: TaskStatus; color: string }[] = [
  { label: "In Progress", value: "IN_PROGRESS", color: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400" },
  { label: "In Review", value: "IN_REVIEW", color: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400" },
  { label: "Done", value: "DONE", color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" },
];

interface KanbanBoardProps {
  onOpenCreateTaskModal: () => void;
}

export default function KanbanBoard({ onOpenCreateTaskModal }: KanbanBoardProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data: tasks, isLoading: loadingTasks } = useGetTasks({ workspaceId });
  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();
  const { data: projects } = useGetProjects({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [boardData, setBoardData] = useState<Record<TaskStatus, Task[]>>({
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  });

  useEffect(() => {
    if (tasks) {
      const initialBoard: Record<TaskStatus, Task[]> = {
        BACKLOG: [],
        TODO: [],
        IN_PROGRESS: [],
        IN_REVIEW: [],
        DONE: [],
      };
      tasks.forEach((task:any) => {
        if (initialBoard[task.status as TaskStatus]) {
          initialBoard[task.status as TaskStatus].push(task);
        }
      });
      Object.keys(initialBoard).forEach((key) => {
        initialBoard[key as TaskStatus].sort((a, b) => a.position - b.position);
      });
      setBoardData(initialBoard);
    }
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const sourceColumn = [...boardData[sourceStatus]];
    const destColumn = source.droppableId === destination.droppableId ? sourceColumn : [...boardData[destStatus]];

    const [movedTask] = sourceColumn.splice(source.index, 1);
    movedTask.status = destStatus;

    destColumn.splice(destination.index, 0, movedTask);

    const updatedBoard = {
      ...boardData,
      [sourceStatus]: sourceColumn,
      [destStatus]: destColumn,
    };
    setBoardData(updatedBoard);

    let newPosition = 1000;
    if (destColumn.length > 1) {
      if (destination.index === 0) {
        newPosition = destColumn[1].position / 2;
      } else if (destination.index === destColumn.length - 1) {
        newPosition = destColumn[destination.index - 1].position + 1000;
      } else {
        newPosition = (destColumn[destination.index - 1].position + destColumn[destination.index + 1].position) / 2;
      }
    }
    movedTask.position = newPosition;

    const updates = destColumn.map((task, idx) => ({
      $id: task.$id,
      status: destStatus,
      position: task.$id === movedTask.$id ? newPosition : (idx + 1) * 1000,
    }));

    bulkUpdateTasks({ json: { tasks: updates } });
  };

  if (loadingTasks) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          <p className="text-xs text-neutral-400 font-medium">Assembling platform matrix...</p>
        </div>
      </div>
    );
  }

  const hasVisibleTasks = COLUMNS.some(col => boardData[col.value]?.length > 0);

  if (!hasVisibleTasks) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950/40 min-h-[400px] my-auto">
        <div className="h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 shadow-inner">
          <ClipboardList className="h-6 w-6 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Your pipeline board is completely dry
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
          No active workflow items currently processing inside these track layers.
        </p>
        <Button
          onClick={onOpenCreateTaskModal}
          className="mt-5 h-10 px-4 bg-neutral-900 hover:opacity-90 dark:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-opacity"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create Your First Task
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-y-hidden pb-4 pt-1 flex-1 min-h-[calc(100vh-220px)] items-start w-full">
          {COLUMNS.map((column) => {
            const currentTasks = boardData[column.value] || [];
            
            return (
              <div 
                key={column.value} 
                className="w-full bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800/40 rounded-xl flex flex-col lg:max-h-full overflow-hidden shadow-sm min-h-[250px]"
              >
                <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/50 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-sm sticky top-0 z-10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${column.color}`}>
                      {column.label}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 bg-neutral-100/80 dark:bg-neutral-800/80 px-1.5 py-0.2 rounded">
                      {currentTasks.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <Droppable droppableId={column.value}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 space-y-3 overflow-y-auto flex-1 no-scrollbar min-h-[150px] transition-colors duration-200 ${
                        snapshot.isDraggingOver ? "bg-neutral-100/40 dark:bg-neutral-800/10" : ""
                      }`}
                    >
                      {currentTasks.map((task, index) => {
                        const targetProject = projects?.find((p) => p.$id === task.projectId);
                        const targetAssignee = members?.documents?.find((m:any) => m.userId === task.assigneeId);

                        return (
                          <Draggable key={task.$id} draggableId={task.$id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl transition-all shadow-sm ${
                                  snapshot.isDragging ? "shadow-md ring-1 ring-neutral-200 dark:ring-neutral-800 scale-[1.02]" : ""
                                }`}
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 line-clamp-2 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                                      {task.name}
                                    </h4>
                                    <div className="h-5 w-5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0 cursor-pointer">
                                      <MoreHorizontal className="h-3.5 w-3.5" />
                                    </div>
                                  </div>

                                  {task.description && (
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500 line-clamp-2 leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-50 dark:border-neutral-800/30 text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                                    {targetProject && (
                                      <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/50 px-1.5 py-0.5 rounded-md text-neutral-500 max-w-[120px]">
                                        <Folder className="h-3 w-3 stroke-[1.5] shrink-0" />
                                        <span className="truncate">{targetProject.name}</span>
                                      </div>
                                    )}

                                    {task.dueDate && (
                                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/50 ml-auto shrink-0">
                                        <Calendar className="h-3 w-3 stroke-[1.5]" />
                                        <span>{format(new Date(task.dueDate), "MMM d")}</span>
                                      </div>
                                    )}

                                    {targetAssignee && (
                                      <div className="h-5 w-5 rounded-full bg-neutral-900 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[8px] text-white tracking-tighter shrink-0 uppercase shadow-inner" title={targetAssignee.name || targetAssignee.email}>
                                        {(targetAssignee.name || targetAssignee.email).charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}