import Elysia from "elysia";
import { trustCaseRoute } from "./index/trust.case";
import { trustRecoveryRoute } from "./index/trust.recovery";

export const trustRoute = new Elysia({ prefix: "/trust" }).use(trustRecoveryRoute).use(trustCaseRoute);
