import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";
import { conf } from "@/config/conf";
import { appwriteAuth } from "@/appwrite/middleware";
import { createTaskSchema, updateTaskSchema, bulkUpdateTasksSchema } from "../Schema";

const app = new Hono()
  .post("/", appwriteAuth, zValidator("json", createTaskSchema), async (c) => {
    try {
      const { name, status, workspaceId, projectId, assigneeId, dueDate, description } = c.req.valid("json");
      const user = c.get("user");
      const database = c.get("databases");

      // Verify the user belongs to the target workspace
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

      // Calculate operational positioning sequence index for Kanban layout
      const highestPositionTasks = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("status", status),
          Query.limit(1)
        ]
      );

      const position = highestPositionTasks.documents.length > 0 
        ? highestPositionTasks.documents[0].position + 1000 
        : 1000;

      const task = await database.createDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          description,
          position
        }
      );

      return c.json({ success: true, data: task }, 201);
    } catch (err) {
      throw err;
    }
  })

  .get("/workspace/:workspaceId", appwriteAuth, async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId");
      const projectId = c.req.query("projectId");
      const status = c.req.query("status");
      const assigneeId = c.req.query("assigneeId");
      const search = c.req.query("search");

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
        return c.json({ error: "Unauthorized access to workspace pipeline" }, 403);
      }

      const queries = [
        Query.equal("workspaceId", workspaceId),
        Query.orderAsc("position")
      ];

      if (projectId) queries.push(Query.equal("projectId", projectId));
      if (status) queries.push(Query.equal("status", status));
      if (assigneeId) queries.push(Query.equal("assigneeId", assigneeId));
      if (search) queries.push(Query.contains("name", search));

      const tasks = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        queries
      );

      return c.json({ success: true, data: tasks.documents });
    } catch (err) {
      throw err;
    }
  })

  .get("/:taskId", appwriteAuth, async (c) => {
    try {
      const taskId = c.req.param("taskId");
      const user = c.get("user");
      const database = c.get("databases");

      const task = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        taskId
      );

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", task.workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Access Denied: Context target out of authorization bounds" }, 403);
      }

      return c.json({ success: true, data: task });
    } catch (err) {
      throw err;
    }
  })

  .patch("/:taskId", appwriteAuth, zValidator("json", updateTaskSchema), async (c) => {
    try {
      const taskId = c.req.param("taskId");
      const updateData = c.req.valid("json");
      const user = c.get("user");
      const database = c.get("databases");

      const existingTask = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        taskId
      );

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", existingTask.workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Unauthorized modification trace block" }, 403);
      }

      const updatedTask = await database.updateDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        taskId,
        updateData
      );

      return c.json({ success: true, data: updatedTask });
    } catch (err) {
      throw err;
    }
  })

  .post("/bulk-update", appwriteAuth, zValidator("json", bulkUpdateTasksSchema), async (c) => {
    try {
      const { tasks } = c.req.valid("json");
      const user = c.get("user");
      const database = c.get("databases");

      if (tasks.length === 0) {
        return c.json({ success: true, message: "No operational indices passed" });
      }

      // Read sample record context to perform authorization sweeps
      const singleTaskSample = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        tasks[0].$id
      );

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", singleTaskSample.workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Unauthorized bulk re-ordering tracking action" }, 403);
      }

      const operations = tasks.map((t) =>
        database.updateDocument(
          conf.appwrite.databaseId,
          conf.appwrite.collections.tasks,
          t.$id,
          { status: t.status, position: t.position }
        )
      );

      await Promise.all(operations);

      return c.json({ success: true, data: { updatedCount: operations.length } });
    } catch (err) {
      throw err;
    }
  })

  .delete("/:taskId", appwriteAuth, async (c) => {
    try {
      const taskId = c.req.param("taskId");
      const user = c.get("user");
      const database = c.get("databases");

      const task = await database.getDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        taskId
      );

      const member = await database.listDocuments(
        conf.appwrite.databaseId,
        conf.appwrite.collections.members,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", task.workspaceId)
        ]
      );

      if (member.total === 0) {
        return c.json({ error: "Access Denied: Only authorized workspace members can remove metrics" }, 403);
      }

      await database.deleteDocument(
        conf.appwrite.databaseId,
        conf.appwrite.collections.tasks,
        taskId
      );

      return c.json({ success: true, data: { $id: taskId } });
    } catch (err) {
      throw err;
    }
  });

export default app;