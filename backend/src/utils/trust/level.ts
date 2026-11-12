import { trustActionPolicy, type TrustActionType } from "./policy";

export type TrustLevel = "good" | "notice" | "warning" | "pause_24h" | "pause_3d" | "block";

const rank: Record<TrustLevel, number> = { good: 0, notice: 1, warning: 2, pause_24h: 3, pause_3d: 4, block: 5 };
export const levelRank = (level: string | null | undefined) => rank[(level as TrustLevel) ?? "good"] ?? 0;

/** Table 3 ladder: good standing, notice, warning, pause 24 hours, pause 3 days, block. The cut-offs come from trustActionPolicy (fractions of the total AHP points). */
export function levelForScore(points: number, serious = false): TrustLevel {
  if (serious || points >= trustActionPolicy.blockedThreshold) return "block";
  if (points >= trustActionPolicy.tier2Threshold) return "pause_3d";
  if (points >= trustActionPolicy.tier1Threshold) return "pause_24h";
  if (points >= trustActionPolicy.warningThreshold) return "warning";
  if (points >= trustActionPolicy.noticeThreshold) return "notice";
  return "good";
}

export const levelActionType = (level: TrustLevel): TrustActionType | null =>
  level === "good" ? null : level === "notice" ? "notice" : level === "warning" ? "warning"
    : level === "block" ? "blocked" : "temporary_restriction";

export const levelPauseHours = (level: TrustLevel) => (level === "pause_24h" ? 24 : level === "pause_3d" ? 72 : 0);

export const levelLabel: Record<TrustLevel, string> = {
  good: "Good standing", notice: "Notice", warning: "Warning",
  pause_24h: "Pause for 24 hours", pause_3d: "Pause for 3 days", block: "Blocked",
};

/** A pause or block is the part of the ladder that a seller's fault rate must also support. */
export const isPauseOrBlock = (level: TrustLevel) => rank[level] >= rank.pause_24h;
