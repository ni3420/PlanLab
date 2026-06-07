import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Request = InferRequestType<typeof client.api.auth.register["$post"]>;
type Response = InferResponseType<typeof client.api.auth.register["$post"]>;

export const useRegister = () => {
  const router = useRouter();

  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth.register["$post"]({json});
      
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/workspace");
    },
    onError: () => {
      toast.error("Failed to register account");
    }
  });

  return mutation;
};