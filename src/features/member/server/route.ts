import { Hono } from "hono";
import { Query } from "node-appwrite";
import { conf } from "@/config/conf";
import { appwriteAuth } from "@/appwrite/middleware";
import {updateMemberSchema} from "../Schema"
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/:workspaceId", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const user = c.get("user");
      const database = c.get("databases");
      const users=c.get("users")

      const currentMemberCheck = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id)
        ]
      );

      if (currentMemberCheck.total === 0) {
        return c.json({ error: "Unauthorized access to workspace directory" }, 403);
      }

      const membersList = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [Query.equal("workspaceId", workspaceId)]
      );

      const usersService =users

      const formattedMembers = await Promise.all(
        membersList.documents.map(async (member) => {
          try {
            const userAccount = await usersService.get(member.userId);
            
            return {
              $id: member.$id,
              userId: member.userId,
              name: userAccount.name || member.name || "Unknown Crew",
              email: userAccount.email || member.email || "No Email",
              role: member.role,
            };
          } catch {
            return {
              $id: member.$id,
              userId: member.userId,
              name: member.name || "Unknown Crew",
              email: member.email || "No Email",
              role: member.role,
            };
          }
        })
      );

      return c.json({ success: true, data: formattedMembers });
    } catch (err) {
      throw err;
    }
  }).patch(
    "/:workspaceId/:memberId", 
    appwriteAuth, 
    zValidator("json", updateMemberSchema), 
    async (c) => {
      try {
        const workspaceId = c.req.param("workspaceId");
        const memberId = c.req.param("memberId");
        
        const { role } = c.req.valid("json"); 
        
        const user = c.get("user");
        const database = c.get("databases");

        if (role !== "ADMIN" && role !== "MEMBER") {
          return c.json({ error: "Invalid role property assigned" }, 400);
        }

        const currentMember = await database.listDocuments(
          conf.appwrite.databaseId,
          conf.appwrite.collections.members,
          [
            Query.equal("userId", user.$id),
            Query.equal("workspaceId", workspaceId),
            Query.equal("role", "ADMIN")
          ]
        );

        if (currentMember.total === 0) {
          return c.json({ error: "Only workspace administrators can modify user roles" }, 403);
        }

        const targetMember = await database.getDocument(
          conf.appwrite.databaseId,
          conf.appwrite.collections.members,
          memberId
        );

        if (targetMember.userId === user.$id) {
          return c.json({ error: "You cannot modify your own administrative role status" }, 400);
        }

        const updatedMember = await database.updateDocument(
          conf.appwrite.databaseId,
          conf.appwrite.collections.members,
          memberId,
          { role }
        );

        return c.json({ success: true, data: updatedMember });
      } catch (err) {
        throw err;
      }
    }
  )
  .delete("/:workspaceId/:memberId", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const memberId = c.req.param("memberId");
      const user = c.get("user");
      const database = c.get("databases");

      const targetMember = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        memberId
      );

      const currentMember = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId)
        ]
      );

      if (currentMember.total === 0) {
        return c.json({ error: "Unauthorized access configuration" }, 403);
      }

      const actingUser = currentMember.documents[0];
      const isSelfLeaving = targetMember.userId === user.$id;
      const isAdminKicking = actingUser.role === "ADMIN";

      if (!isSelfLeaving && !isAdminKicking) {
        return c.json({ error: "Lacking permissions to remove member from workspace" }, 403);
      }

      if (isSelfLeaving) {
        const totalAdminsInWorkspace = await database.listDocuments(
          conf.appwrite.databaseId,
          conf.appwrite.collections.members,
          [
            Query.equal("workspaceId", workspaceId),
            Query.equal("role", "ADMIN")
          ]
        );

        if (actingUser.role === "ADMIN" && totalAdminsInWorkspace.total === 1) {
          return c.json({ error: "Cannot leave workspace. You are the sole active administrator remaining." }, 400);
        }
      }

      await database.deleteDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        memberId
      );

      return c.json({ success: true, data: { $id: memberId } });
    } catch (err) {
      throw err;
    }
  });

export default app;