import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetInviteInfoProps {
  workspaceId: string;
}

export const useGetInviteInfo = ({ workspaceId }: UseGetInviteInfoProps) => {
  return useQuery({
    queryKey: ["workspace-invite", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspace[":workspaceId"]["invite-info"].$get({
        param: { workspaceId },
      });
      
      if (response.status === 403) {
        throw new Error("403_FORBIDDEN");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch invitation details");
      }

      const { data } = await response.json();
      return data;
    },
    retry: false,
  });
};