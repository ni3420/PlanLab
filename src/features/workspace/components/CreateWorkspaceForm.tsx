"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Building2 } from "lucide-react";
import { createWorkspaceSchema } from "@/features/workspace/Schema";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateWorkspace } from "@/features/workspace/api/use-CreateWorkspace";

type WorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

interface WorkSpaceFormProps {
  onCancel?: () => void;
}

export default function WorkSpaceForm({ onCancel }: WorkSpaceFormProps) {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: WorkspaceFormValues) => {
    createWorkspace(
      { json: values },
      {
        onSuccess: () => {
          reset();
          if (onCancel) onCancel();
        },
      }
    );
  };

  return (
    <Card className="w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
      <CardHeader className="space-y-1.5 p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <Building2 className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Create a new workspace
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          Workspaces are shared environments where your team can manage projects, epics, and sprint backlogs.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label 
              htmlFor="name" 
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Workspace name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Acme Engineering, Marketing Team"
              disabled={isPending}
              className="h-10 border-neutral-200 dark:border-neutral-800 bg-transparent focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={onCancel}
                className="h-10 border-neutral-200 dark:border-neutral-800 px-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isPending} 
              className="h-10 px-4 font-medium"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Workspace
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}