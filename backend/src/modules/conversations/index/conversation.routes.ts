import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { ConversationError } from "../services/conversation.error";
import { createConversation } from "../services/conversation.create";
import { createConversationMessage } from "../services/conversation.message.create";
import { listConversationMessages } from "../services/conversation.messages.list";
import { getConversation } from "../services/conversation.get";
import { getConversationUnreadCount } from "../services/conversation.unread-count";
import { listConversations } from "../services/conversation.list";
import { markConversationRead } from "../services/conversation.read";
import { markAllConversationsRead } from "../services/conversation.read-all";
import { canAccessConversation, getConversationSocketUserId } from "../services/conversation.websocket-auth";
import { subscribeConversation, unsubscribeConversation } from "../services/conversation.realtime";
import { uploadConversationAttachment } from "../services/conversation.attachment";
import { setConversationParticipantState } from "../services/conversation.participant.update";
import {
  conversationListQuery,
  conversationParams,
  createConversationBody,
  sendConversationMessageBody,
} from "../model/conversation";

function failure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof ConversationError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Conversation request failed" });
}

export const conversationRoutes = new Elysia().use(sessionAuth)
  .post("/conversations", async ({ session, body, status }) => {
    try { return status(201, await createConversation(session.userId, body)); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer"], body: createConversationBody })
  .get("/conversations", async ({ session, query, status }) => {
    try { return await listConversations(session.userId, query.limit, query.cursor, query.archived ?? false); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], query: conversationListQuery })
  .get("/conversations/unread-count", async ({ session, status }) => {
    try { return await getConversationUnreadCount(session.userId); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"] })
  .get("/conversations/:id", async ({ session, params, status }) => {
    try { return await getConversation(session.userId, params.id); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams })
  .get("/conversations/:id/messages", async ({ session, params, status }) => {
    try { return await listConversationMessages(session.userId, params.id); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams })
  .post("/conversations/:id/messages", async ({ session, params, body, status }) => {
    try { return status(201, await createConversationMessage(session.userId, params.id, body)); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams, body: sendConversationMessageBody })
  .post("/conversations/:id/read", async ({ session, params, status }) => {
    try { return await markConversationRead(session.userId, params.id); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams })
  .post("/conversations/:id/archive", async ({ session, params, status }) => {
    try { return await setConversationParticipantState(session.userId, params.id, { archivedAt: new Date() }); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams })
  .post("/conversations/:id/unarchive", async ({ session, params, status }) => {
    try { return await setConversationParticipantState(session.userId, params.id, { archivedAt: null }); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams })
  .post("/conversations/:id/block", async ({ session, params, status }) => {
    try { return await setConversationParticipantState(session.userId, params.id, { blockedAt: new Date() }); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams })
  .post("/conversations/:id/unblock", async ({ session, params, status }) => {
    try { return await setConversationParticipantState(session.userId, params.id, { blockedAt: null }); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], params: conversationParams })
  .post("/conversations/read-all", async ({ session, status }) => {
    try { return await markAllConversationsRead(session.userId); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"] })
  .post("/conversations/attachment", async ({ session, body, status }) => {
    try { return status(201, await uploadConversationAttachment(session.userId, body.file)); }
    catch (error) { return failure(error, status); }
  }, { role: ["buyer", "seller"], body: t.Object({ file: t.File({ maxSize: "10m" }) }) })
  .ws("/ws/conversations", {
    query: t.Object({ conversationId: t.String({ format: "uuid" }) }),
    async beforeHandle({ request, query, status }) {
      const userId = await getConversationSocketUserId(request);
      if (!userId) return status(401);
      if (!(await canAccessConversation(userId, query.conversationId))) return status(403);
    },
    open(ws) {
      subscribeConversation(ws, ws.data.query.conversationId);
      ws.send(JSON.stringify({ type: "conversation.connected", conversationId: ws.data.query.conversationId }));
    },
    close(ws) {
      unsubscribeConversation(ws);
    },
  });
