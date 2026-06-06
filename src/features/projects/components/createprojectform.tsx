"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { FolderPlus, Loader2, X } from "lucide-react";
import { z } from "zod";

import { createProjectSchema } from "../Schema";
import { useCreateProject } from "@/features/projects/api/use-createproject";
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

type FormValues = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export default function CreateProjectForm({ onCancel }: CreateProjectFormProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { mutate: createProject, isPending } = useCreateProject();

  const form = useForm<FormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      workspaceId: workspaceId || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createProject(
      { json: values },
      {
        onSuccess: () => {
          form.reset();
          if (onCancel) onCancel();
        },
      }
    );
  };

  return (
    <Card className="w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden relative">
      {/* {onCancel && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          disabled={isPending}
          className="absolute top-4 right-4 h-8 w-8 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md"
        >
          <X className="h-4 w-4" />
        </Button>
      )} */}

      <CardHeader className="space-y-1.5 p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <FolderPlus className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Create Project
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          Initialize a dedicated collaborative track context framework inside this workspace layer.
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
                    Project Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="e.g., Core API Refactor, UI Redesign"
                      className="h-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 mt-6">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={onCancel}
                  className="h-10 px-4 border-neutral-200 dark:border-neutral-800 font-medium text-xs text-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="h-10 px-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium text-xs shadow-sm hover:opacity-90 transition-opacity"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Create Track Instance"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}