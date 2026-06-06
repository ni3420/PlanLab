import { Account, Client, Databases, Users } from "node-appwrite";
import { createMiddleware } from "hono/factory";
import { conf } from "@/config/conf";
import { getCookie } from "hono/cookie";
import { Env } from "./types";

export const appwriteAuth = createMiddleware<Env>(async (c, next) => {
  const session = getCookie(c, "token");

  if (!session) {
    return c.json({ error: "Unauthorized: Missing session token" }, 401);
  }

  const client = new Client()
    .setEndpoint(conf.appwrite.endpoint)
    .setProject(conf.appwrite.projectId)
    .setSession(session);

  const adminClient = new Client()
    .setEndpoint(conf.appwrite.endpoint)
    .setProject(conf.appwrite.projectId)
    .setKey(conf.appwrite.secretKey); 

  const account = new Account(client);
  const databases = new Databases(client);
  const users = new Users(adminClient); 

  try {
    const userDoc = await account.get();
    
    c.set("appwriteClient", client);
    c.set("account", account);
    c.set("databases", databases);
    c.set("users", users); 
    c.set("user", {
      $id: userDoc.$id,
      name: userDoc.name,
      email: userDoc.email,
    });

    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized: Invalid or expired session token" }, 401);
  }
});