import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api-postgres";
import { eq, sql } from "drizzle-orm";
import * as schema from "../db/schema";

const pg = drizzle({ client: new PGlite() });
mock.module(`${import.meta.dir}/../db/index.ts`, () => ({ db: pg }));
const { checkUserInactivity } = await import("./check-user-inactivity");

const DAY = 24 * 3_600_000;
let seq = 0;
async function addUser(role: "buyer" | "seller" | "admin", daysInactive: number) {
  const id = `i${++seq}`;
  await pg.insert(schema.user).values({ id, name: id, email: `${id}@t.dev`, role: [role], emailVerified: true, lastActiveAt: new Date(Date.now() - daysInactive * DAY) });
  return id;
}
const notices = async (id: string) => (await pg.select().from(schema.trust_notices).where(eq(schema.trust_notices.recipientId, id))).map((n) => n.kind);
const active = async (id: string) => (await pg.select().from(schema.user).where(eq(schema.user.id, id)))[0]!.isActive;

beforeAll(async () => { await (await pushSchema(schema as never, pg as never)).apply(); });
beforeEach(async () => { await pg.execute(sql`truncate table "user" cascade`); });

describe("inactivity rules (FTM-07, FTM-08)", () => {
  test("FTM-07 a seller inactive for 3 weeks gets one warning and stays active", async () => {
    const id = await addUser("seller", 22);
    expect(await checkUserInactivity()).toEqual({ warningsIssued: 1, accountsBlocked: 0 });
    expect(await notices(id)).toEqual(["inactivity_3w_warning"]);
    expect(await active(id)).toBe(true);
    expect((await checkUserInactivity()).warningsIssued).toBe(0);
    expect(await notices(id)).toEqual(["inactivity_3w_warning"]);
  });
  test("FTM-07 a seller active within 3 weeks gets nothing", async () => {
    const id = await addUser("seller", 20);
    expect(await checkUserInactivity()).toEqual({ warningsIssued: 0, accountsBlocked: 0 });
    expect(await notices(id)).toEqual([]);
    expect(await active(id)).toBe(true);
  });
  test("FTM-08 a seller inactive for more than one month is blocked with a notice", async () => {
    const id = await addUser("seller", 31);
    expect((await checkUserInactivity()).accountsBlocked).toBe(1);
    expect(await active(id)).toBe(false);
    expect(await notices(id)).toEqual(["inactivity_1m_blocked"]);
    const actions = await pg.select().from(schema.trust_actions).where(eq(schema.trust_actions.subjectId, id));
    expect(actions.map((a) => a.actionType)).toEqual(["blocked"]);
  });
  test("buyers follow the same rule and an admin account is never timed", async () => {
    const buyer = await addUser("buyer", 22);
    const admin = await addUser("admin", 60);
    await checkUserInactivity();
    expect(await notices(buyer)).toEqual(["inactivity_3w_warning"]);
    expect(await notices(admin)).toEqual([]);
    expect(await active(admin)).toBe(true);
  });
});
