import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await client.api.auth["current-user"].$get();
      
      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};