import { InferRequestType,InferResponseType } from "hono"
import {client} from "@/lib/rpc"
import { useMutation } from "@tanstack/react-query"

type Request=InferRequestType<typeof client.api.auth.register["$post"]>
type Response=InferResponseType<typeof client.api.auth.register["$post"]>

export const useRegister=()=>{
   const mutation=useMutation<Response,Error,Request>({
    mutationFn:async({json})=>{
        const res=await client.api.auth.register["$post"]({json})
        
        return await res.json()
    }
   })
   return mutation
}