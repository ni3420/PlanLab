import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.workspace[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) throw new Error("Failed to fetch workspace projects");
      const { data } = await response.json();
      return data;
    },
  });
};