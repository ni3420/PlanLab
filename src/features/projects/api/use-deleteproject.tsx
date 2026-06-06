import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$delete"]>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"].$delete({ param });
      if (!response.ok) throw new Error("Failed to terminate project database document");
      return await response.json();
    },
    onSuccess: (_, variables) => {
      toast.success("Project deleted safely");
      queryClient.invalidateQueries({ queryKey: ["project", variables.param.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete project");
    },
  });
};