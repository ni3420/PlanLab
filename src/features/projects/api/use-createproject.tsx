import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects.$post>;
type RequestType = InferRequestType<typeof client.api.projects.$post>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projects.$post({ json });
      if (!response.ok) throw new Error("Failed to initialize project context");
      console.log(response.json())
      return await response.json();
    },
    onSuccess: (res) => {
      if ("data" in res && res.data) {
        toast.success("Project created successfully");
        queryClient.invalidateQueries({ queryKey: ["projects", res.data.workspaceId] });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create project");
    },
  });
};