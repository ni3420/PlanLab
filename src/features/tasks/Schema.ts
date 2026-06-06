import { z } from "zod";

// Shared Task Status Enum
export const TaskStatusEnum = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
]);

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name execution parameter is required"),
  status: TaskStatusEnum,
  workspaceId: z.string().trim().min(1, "Parent workspace scope context is required"),
  projectId: z.string().trim().min(1, "Target project node attachment index is required"),
  assigneeId: z.string().trim().min(1, "Target assignee user parameter tracking is required"),
  dueDate: z.string().datetime("Invalid ISO date-time execution string framework format"),
  description: z.string().trim().optional(),
});

export const updateTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name must remain populated").optional(),
  status: TaskStatusEnum.optional(),
  projectId: z.string().trim().min(1).optional(),
  assigneeId: z.string().trim().min(1).optional(),
  dueDate: z.string().datetime().optional(),
  description: z.string().trim().optional(),
});

// Used to efficiently process positions arrays during Kanban drag-and-drop actions
export const bulkUpdateTasksSchema = z.object({
  tasks: z.array(
    z.object({
      $id: z.string().trim().min(1, "Task document ID index mapping required"),
      status: TaskStatusEnum,
      position: z
        .number()
        .min(0)
        .max(1_000_000_000, "Sequence positioning execution bounds exceeded"),
    })
  ),
});