"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetWorkspace } from "@/features/workspace/api/use-workpaceInfo";
import { useCurrentUser } from "@/features/auth/api/use-currentuser"; 
import InvitationCard from "@/features/member/components/memberinvitioncard";
import { Loader2, LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JoinClientWrapper() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const inviteCode = params.inviteCodeId as string;

  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: workspace, isLoading: isLoadingWorkspace, error } = useGetWorkspace({ workspaceId });

  const isLoading = isLoadingUser || isLoadingWorkspace;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          <p className="text-xs text-neutral-400 font-medium">Validating invitation credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl p-6 text-center space-y-4">
          <div className="mx-auto h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <LogIn className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Authentication Required
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 px-4">
              You must be logged into your account to securely join this workspace context layer.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => router.push(`/login?redirect=/workspace/${workspaceId}/join/${inviteCode}`)}
            className="w-full h-10 font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950"
          >
            Sign In to Accept Invite
          </Button>
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl p-6 text-center space-y-3">
          <ShieldAlert className="mx-auto h-8 w-8 text-red-500 stroke-[1.5]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Invalid Link Configuration
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              This invitation secure token has expired or the workspace path parameters are incorrect.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            className="h-9 text-xs border-neutral-200 dark:border-neutral-800 mt-1"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <InvitationCard 
      workspaceId={workspaceId}
      inviteCode={inviteCode}
      workspaceName={workspace.name}
    />
  );
}