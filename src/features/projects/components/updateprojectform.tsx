"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderEdit, Loader2, Trash2, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { updateProjectSchema } from "../Schema";
import { useUpdateProject } from "@/features/projects/api/use-updateproject";
import { useDeleteProject } from "@/features/projects/api/use-deleteproject";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/ui/input";

type FormValues = z.infer<typeof updateProjectSchema>;

interface UpdateProjectProps {
  initialData: {
    $id: string;
    name: string;
    workspaceId: string;
  };
}

export default function UpdateProject({ initialData }: UpdateProjectProps) {
  const router = useRouter();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const form = useForm<FormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  const onSubmit = (values: FormValues) => {
    updateProject({
      param: { projectId: initialData.$id },
      json: values,
    });
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you absolutely sure you want to delete this project? This structural action cannot be undone."
    );
    
    if (isConfirmed) {
      deleteProject(
        {
          param: { projectId: initialData.$id },
        },
        {
          onSuccess: () => {
            router.push(`/workspace/${initialData.workspaceId}`);
          },
        }
      );
    }
  };

  const isPending = isUpdating || isDeleting;

  return (
    <div className="space-y-6">
      <Card className="w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="space-y-1.5 p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
              <FolderEdit className="h-4 w-4" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Project Settings
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
            Modify structural identities and track naming parameters inside this target reference node.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Project Naming Track
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="e.g., Core API Integration"
                        className="h-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/60 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => router.back()}
                  className="h-10 px-4 border-neutral-200 dark:border-neutral-800 font-medium text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isDirty}
                  className="h-10 px-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium text-xs shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Configurations"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full border-red-200 dark:border-red-950/40 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 p-6 bg-red-50/30 dark:bg-red-950/10 border-b border-red-100 dark:border-red-950/20">
          <CardTitle className="text-base font-semibold tracking-tight text-red-600 dark:text-red-400">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
            Irreversible management destruction loops. Executing this step un-indexes all cascading properties completely.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Delete this project track
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Once executed, all associated epics, boards, sprint cycles, and task items will be completely purged.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Permanently Delete Project
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}