import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth["current-user"].$get();
      
      if (!response.ok) {
        return null;
      }

      const resData = await response.json();
      
      if ("data" in resData) {
        return resData.data;
      }
      
      return null;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};