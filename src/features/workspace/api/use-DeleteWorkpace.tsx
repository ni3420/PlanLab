import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspace[":workspaceId"]["$delete"]>;
type RequestType = InferRequestType<typeof client.api.workspace[":workspaceId"]["$delete"]>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspace[":workspaceId"].$delete({ param });
      if (!response.ok || "error" in response) throw new Error("Failed to delete workspace");
      return await response.json();
    },
    onSuccess: async (data, variables) => {
      if ("data" in data) {  
        toast.success("Workspace deleted");
        
        await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.removeQueries({ queryKey: ["workspace", variables.param.workspaceId] });
      }
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });
};