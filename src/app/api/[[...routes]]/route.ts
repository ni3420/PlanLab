import {Hono} from "hono"
import {handle} from "hono/vercel"
import auth from "@/features/auth/server/route"
import workspace from "@/features/workspace/server/route"

const app=new Hono().basePath("/api")
.route("/auth",auth)
.route("/workspace",workspace)

export const GET=handle(app)
export const POST=handle(app)
export const PATCH=handle(app)
export const DELETE=handle(app)

export type AppType=typeof app