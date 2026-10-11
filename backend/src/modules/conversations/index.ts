import Elysia from "elysia";
import { conversationRoutes } from "./index/conversation.routes";

export const conversationsRoute = new Elysia({ name: "conversations" })
  .use(conversationRoutes);
