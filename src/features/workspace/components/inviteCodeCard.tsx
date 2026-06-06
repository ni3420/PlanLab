"use client";

import { useState } from "react";
import { Check, Copy, Link2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetInviteCode } from "@/features/workspace/api/use-ResetInviteCode";
import { toast } from "sonner";

interface InviteCardProps {
  workspaceId: string;
  inviteCode: string;
}

export default function InviteCard({ workspaceId, inviteCode }: InviteCardProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { mutate: resetInviteCode, isPending } = useResetInviteCode();

  const inviteUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/join/${inviteCode}`
    : `/join/${inviteCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setIsCopied(true);
      toast.success("Link copied", {
        description: "Invitation link has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Please manually select and copy the URL.",
      });
    }
  };

  const handleReset = () => {
    const confirm = window.confirm(
      "Are you sure you want to reset the invite code? The previous link will stop working immediately."
    );
    if (confirm) {
      resetInviteCode({ param: { workspaceId } });
    }
  };

  return (
    <Card className="w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
      <CardHeader className="space-y-1.5 p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <Link2 className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Invite Members
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          Share this secret invitation link with your team members to grant them secure access to this workspace layer.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              readOnly
              value={inviteUrl}
              className="h-10 pr-10 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 font-mono text-xs select-all focus-visible:ring-0"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="h-10 px-3 border-neutral-200 dark:border-neutral-800 shrink-0 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Reset Invitation Token
            </span>
            <p className="text-[11px] text-neutral-400 max-w-[280px] sm:max-w-none">
              Generating a new code instantly invalidates the active pointer token.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={handleReset}
            className="h-9 px-3 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            )}
            Reset Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}