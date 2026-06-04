import { Account, Client, Databases } from "node-appwrite";
import {createMiddleware} from "hono/factory"
import { conf } from "@/config/conf";
import { getCookie, setCookie } from "hono/cookie";

export const middleware=createMiddleware(async(c,next)=>{
    const client=new Client()
    .setEndpoint(conf.appwrite.endpoint)
    .setProject(conf.appwrite.projectId)
    const session=getCookie(c,"token")
    if(!session)
    {
        return c.json({"unauthorized":"user not found"})
    }

    client.setSession(session)

    

})