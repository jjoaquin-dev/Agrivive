import Elysia from "elysia";
import { trustRecoveryRoute } from "./index/trust.recovery";

export const trustRoute = new Elysia({ prefix: "/trust" }).use(trustRecoveryRoute);
