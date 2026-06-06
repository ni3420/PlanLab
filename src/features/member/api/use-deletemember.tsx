import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.members[":workspaceId"][":memberId"]["$delete"]>;
type RequestType = InferRequestType<typeof client.api.members[":workspaceId"][":memberId"]["$delete"]>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":workspaceId"][":memberId"].$delete({ param });
      if (!response.ok) throw new Error("Failed to execute member removal workflow");
      return await response.json();
    },
    onSuccess: (res, variables) => {
      toast.success("Member removed from workspace");
      queryClient.invalidateQueries({ queryKey: ["members", variables.param.workspaceId] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove member");
    },
  });
};