import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspace[":workspaceId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.workspace[":workspaceId"]["$patch"]>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspace[":workspaceId"].$patch({ param, json });
      if (!response.ok) throw new Error("Failed to update workspace");
      return await response.json();
    },
    onSuccess: ( data ) => {
        if("data" in data)
        {
      toast.success("Workspace updated");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.data?.$id] });
    }
},
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });
};