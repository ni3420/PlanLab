"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { CalendarIcon, CheckSquare, Loader2, X, FolderLock } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

import { createTaskSchema } from "../Schema";
import { useCreateTask } from "@/features/tasks/api/use-createtask";
import { useGetProject } from "@/features/projects/api/use-getproject";
import { useGetMembers } from "@/features/member/api/use-getmembers";
import { cn } from "@/lib/utils";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type FormValues = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  onCancel?: () => void;
}

export default function CreateTaskForm({ onCancel }: CreateTaskFormProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;

  const { mutate: createTask, isPending } = useCreateTask();
  const { data: project, isLoading: loadingProject } = useGetProject({ projectId });
  const { data: members, isLoading: loadingMembers } = useGetMembers({ workspaceId });

  const form = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      status: "TODO",
      workspaceId: workspaceId || "",
      projectId: projectId || "",
      assigneeId: "",
      dueDate: "",
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createTask(
      { json: values },
      {
        onSuccess: () => {
          form.reset();
          if (onCancel) onCancel();
        },
      }
    );
  };

  const isLoadingDependencies = loadingProject || loadingMembers;

  return (
    <Card className="w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden relative max-h-[90vh] overflow-y-auto no-scrollbar">
      {/* {onCancel && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          disabled={isPending}
          className="absolute top-4 right-4 h-8 w-8 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md z-10"
        >
          <X className="h-4 w-4" />
        </Button>
      )} */}

      <CardHeader className="space-y-1.5 p-6 border-b border-neutral-100 dark:border-neutral-800/60">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <CheckSquare className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Create Task
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          Allocate parameters and execute an assignment record into your development pipeline layout.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Task Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="e.g., Integrate Appwrite Realtime Subscriptions"
                      className="h-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-sm rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Initial Pipeline Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger className="h-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 rounded-lg text-left text-sm w-full flex items-center justify-between px-3">
                          <SelectValue placeholder="Select current status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                        <SelectItem value="BACKLOG">Backlog</SelectItem>
                        <SelectItem value="TODO">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                      Due Date Execution Target
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={isPending}
                            className={cn(
                              "h-10 w-full pl-3 text-left font-normal border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 rounded-lg text-sm flex items-center justify-start gap-2",
                              !field.value && "text-neutral-400"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4 shrink-0 text-neutral-400" />
                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a target date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString() || "")}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Target Project
                </FormLabel>
                <div className="h-10 border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-950/60 px-3 rounded-lg flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium select-none cursor-not-allowed">
                  <FolderLock className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span className="truncate">
                    {loadingProject ? "Syncing layout track..." : (project?.name || "Target Track Locked")}
                  </span>
                </div>
              </FormItem>

              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Assignee Node
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending || isLoadingDependencies}>
                      <FormControl>
                        <SelectTrigger className="h-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 rounded-lg text-left text-sm w-full flex items-center justify-between px-3">
                          <SelectValue placeholder={isLoadingDependencies ? "Resolving nodes..." : "Select crew member"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                        {members?.map((member: any) => (
                          <SelectItem key={member.userId} value={member.userId}>{member.name || member.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Task Description Context
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      placeholder="Provide functional engineering requirements or specification criteria..."
                      className="min-h-[90px] border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-sm rounded-lg resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 mt-6">
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
                disabled={isPending || isLoadingDependencies}
                className="h-10 px-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium text-xs shadow-sm hover:opacity-90 transition-opacity"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Injecting context...
                  </>
                ) : (
                  "Create Task Segment"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}