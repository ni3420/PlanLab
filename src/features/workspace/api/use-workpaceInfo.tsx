import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: UseGetWorkspaceProps) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspace[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) throw new Error("Failed to fetch workspace");
      const { data } = await response.json();
      return data;
    },
  });
};