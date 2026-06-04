import { conf } from "@/config/conf"
import {Account, Client} from "node-appwrite"

export const CreateAdminClient=()=>{
    const client=new Client()
    .setEndpoint(conf.appwrite.endpoint)
    .setProject(conf.appwrite.projectId)
    .setKey(conf.appwrite.secretKey)

    return {
         get account(){
            return new Account(client)
    }
}
}