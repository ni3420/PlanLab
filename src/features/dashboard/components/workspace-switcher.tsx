"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Plus, Building2 } from "lucide-react";
import { useGetWorkspaces } from "@/features/workspace/api/use-getAllWorkspace";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkspaceSwitcherProps {
  onOpenModal?: () => void;
}

export function WorkspaceSwitcher({ onOpenModal }: WorkspaceSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const { data: workspaces, isLoading } = useGetWorkspaces();

  const activeWorkspaceId = params.workspaceId as string;

  useEffect(() => {
    if (isLoading || !workspaces || workspaces.length === 0) return;

    if (!activeWorkspaceId) {
      router.push(`/workspace/${workspaces[0].$id}`);
    }
  }, [workspaces, isLoading, activeWorkspaceId, router]);

  const onSelect = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`);
  };

  const activeWorkspace = workspaces?.find((w: any) => w.$id === activeWorkspaceId);

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
        <span>Workspaces</span>
        {onOpenModal && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onOpenModal}
            className="h-5 w-5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <Select value={activeWorkspaceId || ""} onValueChange={onSelect} disabled={isLoading}>
        <SelectTrigger className="w-full h-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 focus:ring-0 focus:ring-offset-0 px-3 rounded-lg flex items-center justify-between group">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select workspace"}>
            {activeWorkspace && (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-neutral-900 dark:bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-white uppercase shrink-0">
                  {activeWorkspace.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]">
                  {activeWorkspace.name}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-lg shadow-md z-[100]">
          {workspaces?.map((workspace: any) => (
            <SelectItem
              key={workspace.$id}
              value={workspace.$id}
              className="focus:bg-neutral-100 dark:focus:bg-neutral-900 cursor-pointer py-2 rounded-md"
            >
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase shrink-0">
                  {workspace.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[160px]">
                  {workspace.name}
                </span>
              </div>
            </SelectItem>
          ))}

          {workspaces?.length === 0 && (
            <div className="p-2 text-xs text-neutral-400 text-center flex flex-col items-center gap-1">
              <Building2 className="h-4 w-4 stroke-[1.5]" />
              No workspaces setup
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}