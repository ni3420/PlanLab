"use client";

import { useRouter } from "next/navigation";
import { Building2, Loader2, ArrowRight } from "lucide-react";
import { useJoinWorkspace } from "@/features/workspace/api/use-JoinWorkspace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InvitationCardProps {
  workspaceId: string;
  inviteCode: string;
  workspaceName: string;
}

export default function InvitationCard({ workspaceId, inviteCode, workspaceName }: InvitationCardProps) {
  const router = useRouter();
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

  const handleJoin = () => {
    joinWorkspace(
      {
        param: { workspaceId, inviteCode },
      },
      {
        onSuccess: (res) => {
          if ("data" in res && res.data) {
            router.push(`/workspace/${res.data.$id}`);
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="space-y-1.5 p-6 text-center border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="mx-auto h-12 w-12 rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 shadow-sm mb-2">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Join Workspace
          </CardTitle>
          <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
            You have been securely invited to collaborate on an instance layer.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-1 py-2">
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Workspace Invitation
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight line-clamp-2 px-2">
              {workspaceName}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.push("/workspace")}
              className="w-full sm:flex-1 h-10 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
            >
              Decline
            </Button>
            
            <Button
              type="button"
              disabled={isPending}
              onClick={handleJoin}
              className="w-full sm:flex-1 h-10 font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Accept & Join
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}