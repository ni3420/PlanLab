"use client";

import { useParams } from "next/navigation";
import MemberList from "@/features/member/components/memberList";

export default function ShowAllWorkspaceMembers() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  if (!workspaceId) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <MemberList workspaceId={workspaceId} />
    </div>
  );
}