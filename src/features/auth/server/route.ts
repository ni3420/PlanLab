import { Hono } from "hono";
import {zValidator} from "@hono/zod-validator"
import {setCookie} from "hono/cookie"
import { LoginSchema, registerSchema } from "../Schema";
import { CreateAdminClient } from "@/appwrite/adminclient";
import { ID } from "node-appwrite";
const app=new Hono()
.post("/register",zValidator("json",registerSchema),async(c)=>{
try {
        const {name,email,password}=c.req.valid("json")
        const {account}= CreateAdminClient()
        const user=await account.create(ID.unique(),email,password,name)
    
        const session=await account.createEmailPasswordSession(
            email,
            password
        )
        setCookie(c,"token",session.secret,{
            httpOnly:true,
            secure:true,
    
        })
    
        return c.json({success:true,data:user})
    
} catch(err)  {
    throw err    
}
})
export default app