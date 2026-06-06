"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings2, Trash2 } from "lucide-react";
import { updateWorkspaceSchema } from "@/features/workspace/Schema";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateWorkspace } from "@/features/workspace/api/use-UpdateWorkapce";
import { useDeleteWorkspace } from "@/features/workspace/api/use-DeleteWorkpace";
import { useRouter } from "next/navigation";
type UpdateFormValues = z.infer<typeof updateWorkspaceSchema>;

interface WorkspaceUpdateProps {
  initialData: {
    $id: string;
    name: string;
  };
  onCancel?: () => void;
}

export default function WorkspaceUpdate({ initialData, onCancel }: WorkspaceUpdateProps) {
  const router=useRouter()

  const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
      });
    }
  }, [initialData, reset]);

  const onSubmit = (values: UpdateFormValues) => {
    updateWorkspace({
      param: { workspaceId: initialData.$id },
      json: values,
    });
  };

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this workspace and all its members?");
    if (confirm) {
      deleteWorkspace({
        param: { workspaceId: initialData.$id },
        
      },{onSuccess:()=>{
        router.push("/workspace")
      }});
    }
  };

  const isPending = isUpdating || isDeleting;

  return (
    <div className="space-y-6 w-full">
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
        <CardHeader className="space-y-1.5 p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
              <Settings2 className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Workspace Settings
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
            Change the name or manage the preferences for this corporate workspace context.
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
                placeholder="Update workspace name"
                disabled={isPending}
                className="h-10 border-neutral-200 dark:border-neutral-800 bg-transparent"
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
                  className="h-10 border-neutral-200 dark:border-neutral-800 px-4 text-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isPending} 
                className="h-10 px-4 font-medium"
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/30 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
              Deleting a workspace is permanent and will remove all associated projects, epics, and member assignments immediately.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="h-10 px-4 font-medium bg-red-600 hover:bg-red-700 text-white shrink-0"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Workspace
          </Button>
        </div>
      </Card>
    </div>
  );
}