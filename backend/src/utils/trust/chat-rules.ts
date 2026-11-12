import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../../db";
import { conversation_messages, trust_events } from "../../db/schema";
import { evaluateTrustAction } from "./evaluate-action";
import { recordTrustEvent } from "./index";
import { trustPolicyWeights, trustScoreWindowStart } from "./policy";

/** Table 3. Spam: the same message 5 or more times in 10 minutes. Personal data: a phone or email in a chat message. */
export const SPAM_COPIES = 5;
export const SPAM_WINDOW_MINUTES = 10;
export const SPAM_PAUSE_MINUTES = 10;
/** The 2nd spam in 90 days adds the chat spam points. The 3rd personal-data message in 90 days adds the personal-data points. Later ones repeat the step. */
export const SPAM_POINT_EVERY = 2;
export const PERSONAL_DATA_POINT_EVERY = 3;
export const HIDDEN_MESSAGE_TEXT = "This message was hidden because it had a phone number or an email address.";

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE = /(?:\+?\d[\s().-]?){9,}/;
export const containsPersonalData = (text: string) => EMAIL.test(text) || PHONE.test(text);

const minutes = (count: number) => count * 60_000;

async function countEvents(userId: string, kind: string, now: Date) {
  const since = trustScoreWindowStart(now) ?? new Date(0);
  const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(trust_events).where(and(
    eq(trust_events.subjectId, userId), eq(trust_events.kind, kind), gte(trust_events.createdAt, since)));
  return Number(row?.n ?? 0);
}

async function record(userId: string, kind: "chat_spam" | "chat_personal_data", every: number, key: string, now: Date, reason: string) {
  const weight = (await countEvents(userId, kind, now) + 1) % every === 0 ? trustPolicyWeights[kind] : 0;
  const eventKey = `${kind}:${userId}:${key}`;
  const inserted = await db.transaction((tx) => recordTrustEvent(tx, { eventKey, subjectId: userId, kind, classification: "verified", weight, reason }));
  if (inserted.length) await evaluateTrustAction(userId, null, eventKey, kind);
  return weight;
}

export type ChatScreen = { hidden: boolean };
export class ChatRuleError extends Error {
  constructor(readonly statusCode: number, message: string) { super(message); }
}

/**
 * Runs before a chat message is saved. A person who sent the same message 5 times in 10 minutes cannot send for 10 minutes.
 * A message with a phone number or an email is saved hidden, so the other person never sees it.
 * Events are saved before any refusal, so the refusal cannot undo them.
 */
export async function screenChatMessage(userId: string, body: string, clientMessageId: string, now = new Date()): Promise<ChatScreen> {
  const [pause] = await db.select({ at: trust_events.createdAt }).from(trust_events).where(and(
    eq(trust_events.subjectId, userId), eq(trust_events.kind, "chat_spam"),
    gte(trust_events.createdAt, new Date(now.getTime() - minutes(SPAM_PAUSE_MINUTES))))).orderBy(sql`${trust_events.createdAt} desc`).limit(1);
  if (pause) {
    const left = Math.max(1, Math.ceil((pause.at.getTime() + minutes(SPAM_PAUSE_MINUTES) - now.getTime()) / 60_000));
    throw new ChatRuleError(429, `You sent the same message too many times. You can send messages again in ${left} minute${left === 1 ? "" : "s"}.`);
  }
  const [copies] = await db.select({ n: sql<number>`count(*)::int` }).from(conversation_messages).where(and(
    eq(conversation_messages.senderId, userId), eq(conversation_messages.body, body),
    gte(conversation_messages.createdAt, new Date(now.getTime() - minutes(SPAM_WINDOW_MINUTES)))));
  if (Number(copies?.n ?? 0) + 1 >= SPAM_COPIES) {
    await record(userId, "chat_spam", SPAM_POINT_EVERY, String(now.getTime()), now, "The same message 5 times in 10 minutes");
    throw new ChatRuleError(429, `You sent the same message ${SPAM_COPIES} times. You cannot send messages for ${SPAM_PAUSE_MINUTES} minutes.`);
  }
  if (containsPersonalData(body)) {
    await record(userId, "chat_personal_data", PERSONAL_DATA_POINT_EVERY, clientMessageId, now, "Phone number or email in a chat message");
    return { hidden: true };
  }
  return { hidden: false };
}
