"use client";

import { MoreVertical, ShieldAlert, ShieldCheck, UserMinus, Users } from "lucide-react";
import { useGetMembers } from "@/features/member/api/use-getmembers";
import { useUpdateMember } from "@/features/member/api/use-updatemember";
import { useDeleteMember } from "@/features/member/api/use-deletemember";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberListProps {
  workspaceId: string;
  currentUserId?: string;
}

export default function MemberList({ workspaceId, currentUserId }: MemberListProps) {
  const { data: members, isLoading } = useGetMembers({ workspaceId });
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();

  const handleRoleChange = (memberId: string, role: "ADMIN" | "MEMBER") => {
    updateMember({
      param: { workspaceId, memberId },
      json: { role },
    });
  };

  const handleKickMember = (memberId: string) => {
    const confirm = window.confirm("Are you sure you want to remove this member from the workspace?");
    if (confirm) {
      deleteMember({
        param: { workspaceId, memberId },
      });
    }
  };

  const isMutating = isUpdating || isDeleting;

  if (isLoading) {
    return (
      <Card className="w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
        <CardHeader className="space-y-1.5 p-6 animate-pulse">
          <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-72 bg-neutral-100 dark:bg-neutral-800/60 rounded" />
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3 w-24 bg-neutral-100 dark:bg-neutral-800/60 rounded" />
                </div>
              </div>
              <div className="h-8 w-8 rounded-md bg-neutral-100 dark:bg-neutral-800/60" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
      <CardHeader className="space-y-1.5 p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <Users className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Workspace Members
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          Manage access roles, permissions profiles, and membership allocations for this active environment layer.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 divide-y divide-neutral-100 dark:divide-neutral-800/60">
        {members?.map((member: any) => {
          const isSelf = member.userId === currentUserId;
          const isAdmin = member.role === "admin";

          return (
            <div key={member.$id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-800 shrink-0">
                  <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase">
                    {member.name?.substring(0, 2) || "MB"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {member.name || "Workspace Member"}
                    </span>
                    {isAdmin ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 truncate">
                    {member.email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-[10px]">
                  {member.role}
                </span>

                {!isSelf && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isMutating}
                        className="h-8 w-8 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md focus:ring-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-lg">
                      {isAdmin ? (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.$id, "member")}
                          className="text-xs focus:bg-neutral-100 dark:focus:bg-neutral-900 cursor-pointer rounded-md"
                        >
                          Demote to Member
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.$id, "admin")}
                          className="text-xs focus:bg-neutral-100 dark:focus:bg-neutral-900 cursor-pointer rounded-md"
                        >
                          Promote to Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleKickMember(member.$id)}
                        className="text-xs text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer rounded-md flex items-center gap-1.5 font-medium"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          );
        })}

        {members?.length === 0 && (
          <div className="py-6 text-center text-xs text-neutral-400">
            No registered members indexed inside this context node.
          </div>
        )}
      </CardContent>
    </Card>
  );
}