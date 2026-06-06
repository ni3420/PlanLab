import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import { LoginSchema, registerSchema } from "../Schema";
import { CreateAdminClient } from "@/appwrite/adminclient";
import { appwriteAuth } from "@/appwrite/middleware";
import { ID } from "node-appwrite";

const app = new Hono()
  .post("/register", zValidator("json", registerSchema), async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");
      const { account } = CreateAdminClient();
      
      const user = await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);
      
      setCookie(c, "token", session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true, data: user });
    } catch (err) {
      throw err;
    }
  })

  .post("/login", zValidator("json", LoginSchema), async (c) => {
    try {
      const { email, password } = c.req.valid("json");
      const { account } = CreateAdminClient();

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, "token", session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true, data: { userId: session.userId } });
    } catch (err) {
      throw err;
    }
  })

  .post("/logout", appwriteAuth, async (c) => {
    try {
      const account = c.get("account");
      
      await account.deleteSession("current");
      deleteCookie(c, "token", { path: "/" });

      return c.json({ success: true, data: { message: "Logged out successfully" } });
    } catch (err) {
      throw err;
    }
  })

  .get("/current-user", appwriteAuth, async (c) => {
    try {
      const user = c.get("user");
      
      return c.json({ success: true, data: user });
    } catch (err) {
      throw err;
    }
  });

export default app;