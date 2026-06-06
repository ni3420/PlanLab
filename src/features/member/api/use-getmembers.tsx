import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) throw new Error("Failed to fetch members data layout");
      const { data } = await response.json();
      return data;
    },
  });
};