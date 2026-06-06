"use client";

import { useGetInviteInfo } from "@/features/workspace/api/use-inviteCardInfo";
import InviteCard from "../components/inviteCodeCard";
import { Loader2, ShieldAlert } from "lucide-react";

interface InviteSectionWrapperProps {
  workspaceId: string;
}

export function InviteSectionWrapper({ workspaceId }: InviteSectionWrapperProps) {
  const { data: inviteInfo, isLoading, error } = useGetInviteInfo({ workspaceId });
  console.log(inviteInfo)

  if (isLoading) {
    return (
      <div className="w-full h-32 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-center bg-white dark:bg-neutral-900">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error?.message === "403_FORBIDDEN") {
    return (
      <div className="w-full p-6 border border-red-100 dark:border-red-950/30 rounded-xl bg-red-50/30 dark:bg-red-950/10 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-neutral-100">
            Access Restricted (403 Forbidden)
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Invitation configurations and cryptographic reference tokens are restricted exclusively to workspace administrators.
          </p>
        </div>
      </div>
    );
  }

  if (!inviteInfo) return null;

  return (
    <InviteCard 
      workspaceId={inviteInfo.$id} 
      inviteCode={inviteInfo.inviteCode} 
    />
  );
}