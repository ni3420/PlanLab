import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.members[":workspaceId"][":memberId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.members[":workspaceId"][":memberId"]["$patch"]>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param ,json}) => {
      const response = await client.api.members[":workspaceId"][":memberId"].$patch({ param ,json});
      if (!response.ok) throw new Error("Failed to update workspace member credentials");
      return await response.json();
    },
    onSuccess: (_, variables) => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members", variables.param.workspaceId] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update member role");
    },
  });
};