import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";
import { conf } from "@/config/conf";
import { appwriteAuth } from "@/appwrite/middleware";
import { createProjectSchema, updateProjectSchema } from "../Schema";

const app = new Hono()
  .post("/", appwriteAuth, zValidator("json", createProjectSchema), async (c) => {
    try {
      const { name, workspaceId } = c.req.valid("json");
      const user = c.get("user");
      const database = c.get("databases");

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Unauthorized: You are not a member of this workspace" }, 403);
      }

      const project = await database.createDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.projects,
        ID.unique(),
        {
          name,
          workspaceId,
        }
      );

      return c.json({ success: true, data: project }, 201);
    } catch (err) {
      throw err;
    }
  })

  .get("/workspace/:workspaceId", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const user = c.get("user");
      const database = c.get("databases");

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Unauthorized access to workspace projects" }, 403);
      }

      const projects = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.projects,
        [Query.equal("workspaceId", workspaceId)]
      );

      return c.json({ success: true, data: projects.documents });
    } catch (err) {
      throw err;
    }
  })

  .get("/:projectId", appwriteAuth, async (c) => {
    try {
      const projectId = c.req.param("projectId");
      const user = c.get("user");
      const database = c.get("databases");

      const project = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.projects,
        projectId
      );

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", project.workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Unauthorized access to project metrics" }, 403);
      }

      return c.json({ success: true, data: project });
    } catch (err) {
      throw err;
    }
  })

  .patch("/:projectId", appwriteAuth, zValidator("json", updateProjectSchema), async (c) => {
    try {
      const projectId = c.req.param("projectId");
      const { name } = c.req.valid("json");
      const user = c.get("user");
      const database = c.get("databases");

      const project = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.projects,
        projectId
      );

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", project.workspaceId),
          Query.equal("role", "ADMIN")
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Only workspace admins can modify project configurations" }, 403);
      }

      const updatedProject = await database.updateDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.projects,
        projectId,
        { name }
      );

      return c.json({ success: true, data: updatedProject });
    } catch (err) {
      throw err;
    }
  })

  .delete("/:projectId", appwriteAuth, async (c) => {
    try {
      const projectId = c.req.param("projectId");
      const user = c.get("user");
      const database = c.get("databases");

      const project = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.projects,
        projectId
      );

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", project.workspaceId),
          Query.equal("role", "ADMIN")
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Only workspace admins can delete projects" }, 403);
      }

      await database.deleteDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.projects,
        projectId
      );

      return c.json({ success: true, data: { $id: projectId } });
    } catch (err) {
      throw err;
    }
  });

export default app;