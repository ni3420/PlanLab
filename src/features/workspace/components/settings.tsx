"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetWorkspace } from "@/features/workspace/api/use-workpaceInfo"
import WorkspaceUpdate from "@/features/workspace/components/WorkspaceUpadte";
import InviteCard from "@/features/workspace/components/inviteCodeCard";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const { data: workspace, isLoading, error } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          <p className="text-xs text-neutral-400 font-medium">Loading workspace settings...</p>
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center p-6">
        <div className="max-w-md text-center flex flex-col items-center gap-3 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-white dark:bg-neutral-900 shadow-sm">
          <AlertCircle className="h-8 w-8 text-red-500 stroke-[1.5]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Workspace connection failed
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              The requested workspace configuration metadata could not be fetched or your account lacks explicit admin properties.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/workspace")}
            className="h-9 text-xs border-neutral-200 dark:border-neutral-800 mt-2"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Workspace Overview
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Manage your organization credentials, workspace membership tokens, and instance lifecycle settings.
        </p>
      </div>

      <WorkspaceUpdate
        initialData={{
          $id: workspace.$id,
          name: workspace.name,
        }}
        onCancel={() => router.back()}
      />

      <InviteCard 
        workspaceId={workspace.$id} 
        inviteCode={workspace.inviteCode} 
      />
    </div>
  );
}