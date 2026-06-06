import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.tasks["bulk-update"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.tasks["bulk-update"]["$post"]>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"].$post({ json });
      if (!response.ok) throw new Error("Failed to push batch board indices re-alignment");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Board configuration sync completed");
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Safely re-syncs the complete board view
    },
    onError: (err) => {
      toast.error(err.message || "Failed to process structural drag drop matrix sync");
    },
  });
};