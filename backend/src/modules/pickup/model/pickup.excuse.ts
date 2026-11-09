import { t } from "elysia";

export const excuseReasons = ["rain", "sick", "no_transport", "other"] as const;

export const excuseBody = t.Object({
  reason: t.UnionEnum([...excuseReasons]),
  details: t.Optional(t.String({ maxLength: 500 })),
});
export const excuseDecisionBody = t.Object({ accept: t.Boolean(), note: t.Optional(t.String({ maxLength: 500 })) });
export type ExcuseBody = typeof excuseBody.static;
