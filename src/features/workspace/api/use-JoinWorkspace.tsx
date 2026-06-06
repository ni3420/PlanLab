import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspace[":workspaceId"]["join"][":inviteCode"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspace[":workspaceId"]["join"][":inviteCode"]["$post"]>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspace[":workspaceId"]["join"][":inviteCode"].$post({ param });
      if (!response.ok) throw new Error("Failed to join workspace context");
      console.log(response)
      return await response.json();
    },
    onSuccess: (res) => {
      if ("data" in res && res.data) {
        toast.success(`Joined workspace successfully`);
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({ queryKey: ["workspace", res.data.$id] });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to join workspace");
    },
  });
};