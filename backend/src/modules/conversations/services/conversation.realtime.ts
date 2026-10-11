type ConversationSocket = {
  send: (data: string) => unknown;
};

const subscriptions = new Map<string, Set<ConversationSocket>>();
const socketConversations = new WeakMap<object, Set<string>>();

export function subscribeConversation(socket: object & ConversationSocket, conversationId: string) {
  let sockets = subscriptions.get(conversationId);
  if (!sockets) {
    sockets = new Set();
    subscriptions.set(conversationId, sockets);
  }
  sockets.add(socket);

  let conversations = socketConversations.get(socket);
  if (!conversations) {
    conversations = new Set();
    socketConversations.set(socket, conversations);
  }
  conversations.add(conversationId);
}

export function unsubscribeConversation(socket: object & ConversationSocket) {
  const conversations = socketConversations.get(socket);
  if (!conversations) return;
  for (const conversationId of conversations) {
    const sockets = subscriptions.get(conversationId);
    sockets?.delete(socket);
    if (sockets?.size === 0) subscriptions.delete(conversationId);
  }
  socketConversations.delete(socket);
}

export function publishConversationMessage(conversationId: string, message: unknown) {
  const sockets = subscriptions.get(conversationId);
  if (!sockets) return;
  const payload = JSON.stringify({ type: "conversation.message.created", conversationId, message });
  for (const socket of sockets) socket.send(payload);
}
