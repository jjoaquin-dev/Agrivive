import Elysia from "elysia";
import { adminPerformanceRoute } from "./index/admin.performance";

export const adminRoute = new Elysia({ prefix: "/admin" }).use(adminPerformanceRoute);
