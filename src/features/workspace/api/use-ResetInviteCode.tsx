import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspace[":workspaceId"]["reset-invite"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspace[":workspaceId"]["reset-invite"]["$post"]>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspace[":workspaceId"]["reset-invite"].$post({ param });
      if (!response.ok) throw new Error("Failed to reset invite code");
      return await response.json();
    },
    onSuccess: ( data ) => {
        if("data" in data)
        {
      toast.success("Invite code rotated");
      queryClient.invalidateQueries({ queryKey: ["workspace", data.data.$id] });
    }},
    onError: () => {
      toast.error("Failed to reset invite code");
    },
  });
};