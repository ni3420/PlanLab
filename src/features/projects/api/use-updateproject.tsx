import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$patch"]>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.projects[":projectId"].$patch({ param, json });
      if (!response.ok) throw new Error("Failed to update project configurations");
      return await response.json();
    },
    onSuccess: (res, variables) => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["project", variables.param.projectId] });
      if ("data" in res && res.data) {
        queryClient.invalidateQueries({ queryKey: ["projects", res.data.workspaceId] });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update project attributes");
    },
  });
};