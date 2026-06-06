import {z} from "zod"

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  workspaceId: z.string().trim().min(1, "Workspace ID reference is required"),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name must be at least 1 character"),
});