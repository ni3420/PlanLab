import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";
import { conf } from "@/config/conf";
import { appwriteAuth } from "@/appwrite/middleware";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../Schema";
import { generateInviteCode } from "../genrate";

const app = new Hono()
  .post("/", appwriteAuth, zValidator("json", createWorkspaceSchema), async (c) => {
    try {
      const { name } = c.req.valid("json");
      const user = c.get("user");
      const database = c.get("databases");

      const workspace = await database.createDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        ID.unique(),
        {
          name,
          userId: user.$id,
          inviteCode: generateInviteCode(8),
        }
      );

      await database.createDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: "ADMIN",
        }
      );

      return c.json({ success: true, data: workspace }, 201);
    } catch (err) {
      console.log(err);
      throw err;
    }
  })

  .get("/", appwriteAuth, async (c) => {
    try {
      const user = c.get("user");
      const database = c.get("databases");

      const members = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [Query.equal("userId", user.$id)]
      );

      if (members.total === 0) {
        return c.json({ success: true, data: [] });
      }

      const workspaceIds = members.documents.map((m) => m.workspaceId);

      const workspaces = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        [Query.equal("$id", workspaceIds)]
      );

      return c.json({ success: true, data: workspaces.documents });
    } catch (err) {
      throw err;
    }
  })

  .get("/:workspaceId/invite-info", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const user = c.get("user");
      const database = c.get("databases");

      const memberVerify = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId),
          Query.equal("role", "ADMIN")
        ]
      );

      if (memberVerify.total === 0) {
        return c.json({ error: "Access Denied: Administrative permissions required" }, 403);
      }

      const workspace = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        workspaceId
      );

      return c.json({ 
        success: true, 
        data: { 
          $id: workspace.$id, 
          inviteCode: workspace.inviteCode 
        } 
      });
    } catch (err) {
      throw err;
    }
  })

  .get("/:workspaceId", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const queryInviteCode = c.req.query("inviteCode");
      const user = c.get("user");
      const database = c.get("databases");

      const workspace = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        workspaceId
      );

      if (queryInviteCode && workspace.inviteCode === queryInviteCode) {
        return c.json({ success: true, data: workspace });
      }

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("workspaceId", workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Unauthorized access to workspace" }, 403);
      }

      return c.json({ success: true, data: workspace });
    } catch (err) {
      throw err;
    }
  })

  .patch("/:workspaceId", appwriteAuth, zValidator("json", updateWorkspaceSchema), async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const { name } = c.req.valid("json");
      const user = c.get("user");
      const database = c.get("databases");

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId),
          Query.equal("role", "ADMIN")
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Only workspace admins can modify properties" }, 403);
      }

      const updatedWorkspace = await database.updateDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        workspaceId,
        { name }
      );

      return c.json({ success: true, data: updatedWorkspace });
    } catch (err) {
      throw err;
    }
  })

  .delete("/:workspaceId", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const user = c.get("user");
      const database = c.get("databases");

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId),
          Query.equal("role", "ADMIN")
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Only workspace admins can delete workspaces" }, 403);
      }

      await database.deleteDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        workspaceId
      );

      const localizedMembers = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [Query.equal("workspaceId", workspaceId)]
      );

      const batchDeletions = localizedMembers.documents.map((m) =>
        database.deleteDocument(
          conf.appwrite.databaseId, 
          conf.appwrite.collections.members, 
          m.$id
        )
      );
      await Promise.all(batchDeletions);

      return c.json({ success: true, data: { $id: workspaceId } });
    } catch (err) {
      throw err;
    }
  })

  .post("/:workspaceId/reset-invite", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const user = c.get("user");
      const database = c.get("databases");

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId),
          Query.equal("role", "ADMIN")
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Only workspace admins can rotate tokens" }, 403);
      }

      const updatedWorkspace = await database.updateDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        workspaceId,
        { inviteCode: generateInviteCode(8) }
      );

      return c.json({ success: true, data: updatedWorkspace });
    } catch (err) {
      throw err;
    }
  })

  .post("/:workspaceId/join/:inviteCode", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const inviteCode = c.req.param("inviteCode");
      const user = c.get("user");
      const database = c.get("databases");

      const workspaces = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.workspace,
        [
          Query.equal("$id", workspaceId),
          Query.equal("inviteCode", inviteCode)
        ]
      );

      if (workspaces.total === 0) {
        return c.json({ error: "Invalid workspace ID or invitation token" }, 404);
      }

      const targetWorkspace = workspaces.documents[0];

      const activeMembership = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", targetWorkspace.$id)
        ]
      );

      if (activeMembership.total > 0) {
        return c.json({ error: "You are already a member of this workspace" }, 400);
      }

      await database.createDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId: targetWorkspace.$id,
          role: "MEMBER",
        }
      );

      return c.json({ success: true, data: targetWorkspace });
    } catch (err) {
      throw err;
    }
  });

export default app;