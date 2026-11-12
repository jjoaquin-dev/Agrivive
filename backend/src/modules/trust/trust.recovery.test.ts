import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api-postgres";
import { and, eq, isNull, sql } from "drizzle-orm";
import * as schema from "../../db/schema";

const pg = drizzle({ client: new PGlite() });
const here = import.meta.dir;
let codesSent = 0;
mock.module(`${here}/../../db/index.ts`, () => ({ db: pg }));
mock.module(`${here}/../auth/index.ts`, () => ({
  auth: { api: { sendVerificationOTP: async () => { codesSent++; }, checkVerificationOTP: async () => ({}) } },
}));
const { requestTrustRecovery, verifyTrustRecovery } = await import("./services/trust.recovery");

let seq = 0;
async function addUserWith(actionType: "blocked" | "temporary_restriction") {
  const id = `u${++seq}`;
  const email = `${id}@t.dev`;
  await pg.insert(schema.user).values({ id, name: id, email, role: ["buyer"], emailVerified: true, isActive: actionType !== "blocked" });
  await pg.insert(schema.trust_actions).values({
    actionKey: `a${seq}`, subjectId: id, actionType, level: actionType === "blocked" ? "block" : "pause_24h",
    weightedPoints: 24, policyVersion: "x", reason: "Test", endsAt: actionType === "blocked" ? null : new Date(Date.now() + 3_600_000),
  });
  return { id, email };
}
const openActions = async (id: string) => (await pg.select().from(schema.trust_actions).where(and(eq(schema.trust_actions.subjectId, id), isNull(schema.trust_actions.revokedAt)))).length;

beforeAll(async () => { await (await pushSchema(schema as never, pg as never)).apply(); });
beforeEach(async () => { codesSent = 0; await pg.execute(sql`truncate table "user" cascade`); });

describe("account recovery", () => {
  test("a paused account gets no code and cannot lift the pause", async () => {
    const paused = await addUserWith("temporary_restriction");
    await requestTrustRecovery({ email: paused.email });
    expect(codesSent).toBe(0);
    await expect(verifyTrustRecovery({ email: paused.email, otp: "123456" })).rejects.toMatchObject({ statusCode: 400 });
    expect(await openActions(paused.id)).toBe(1);
  });
  test("a blocked account gets a code and is restored by it", async () => {
    const blocked = await addUserWith("blocked");
    await requestTrustRecovery({ email: blocked.email });
    expect(codesSent).toBe(1);
    await verifyTrustRecovery({ email: blocked.email, otp: "123456" });
    expect(await openActions(blocked.id)).toBe(0);
    expect((await pg.select().from(schema.user).where(eq(schema.user.id, blocked.id)))[0]!.isActive).toBe(true);
  });
});
