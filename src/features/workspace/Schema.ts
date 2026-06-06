import * as z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(50),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(50),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]),
});