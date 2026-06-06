import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string;
  status?: string;
  assigneeId?: string;
  search?: string;
}

export const useGetTasks = ({ 
  workspaceId, 
  projectId, 
  status, 
  assigneeId, 
  search 
}: UseGetTasksProps) => {
  return useQuery({
    // Keep queries separate based on changing search filters or selected workspace parameters
    queryKey: ["tasks", workspaceId, { projectId, status, assigneeId, search }],
    queryFn: async () => {
      const response = await client.api.tasks.workspace[":workspaceId"].$get({
        param: { workspaceId },
        query: {
          ...(projectId && { projectId }),
          ...(status && { status }),
          ...(assigneeId && { assigneeId }),
          ...(search && { search }),
        },
      });
      if (!response.ok) throw new Error("Failed to pull workspace pipeline tasks");
      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId, // Prevent execution on unallocated workspace indices
  });
};