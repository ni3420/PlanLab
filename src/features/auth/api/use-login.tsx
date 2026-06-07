import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Request = InferRequestType<typeof client.api.auth.login["$post"]>;
type Response = InferResponseType<typeof client.api.auth.login["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth.login["$post"]({ json });
      
      if (!res.ok) {
        throw new Error("Authentication failed");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Welcome back");
      
      // Force invalidate the session cache to pull fresh profile credentials instantly
      queryClient.invalidateQueries({ queryKey: ["current"] });
      
      router.push("/workspace");
    },
    onError: () => {
      toast.error("Invalid credentials provided");
    }
  });

  return mutation;
};