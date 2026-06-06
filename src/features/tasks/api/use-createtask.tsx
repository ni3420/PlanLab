import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.tasks.$post>;
type RequestType = InferRequestType<typeof client.api.tasks.$post>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json });
      if (!response.ok) throw new Error("Failed to initialize task context");
      return await response.json();
    },
    onSuccess: (res) => {
      if ("data" in res && res.data) {
        toast.success("Task created successfully");
        queryClient.invalidateQueries({ queryKey: ["tasks", res.data.workspaceId] });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create task tracking node");
    },
  });
};