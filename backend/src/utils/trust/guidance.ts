import { levelLabel, type TrustLevel } from "./level";
import { trustActionPolicy } from "./policy";

export type TrustRole = "buyer" | "seller";

/** The levels in order, with the score each one starts at. */
export function levelLadder(role: TrustRole) {
  const p = trustActionPolicy;
  const stop = role === "buyer" ? "New reservations are off." : "New listings and Boost are off.";
  const rows: { level: TrustLevel; fromPoints: number; summary: string }[] = [
    { level: "good", fromPoints: 0, summary: "Nothing happens." },
    { level: "notice", fromPoints: p.noticeThreshold, summary: "You get a notice. Nothing is restricted." },
    { level: "warning", fromPoints: p.warningThreshold, summary: "You get a warning. Nothing is restricted yet." },
    { level: "pause_24h", fromPoints: p.tier1Threshold, summary: `${stop} It ends after 24 hours.` },
    { level: "pause_3d", fromPoints: p.tier2Threshold, summary: `${stop} It ends after 3 days.` },
    { level: "block", fromPoints: p.blockedThreshold, summary: "Your account is blocked. Restore it with an email code." },
  ];
  return rows.map((row) => ({ ...row, label: levelLabel[row.level] }));
}

/** What the person should do right now, in plain words. */
export function levelGuidance(level: TrustLevel, role: TrustRole) {
  const avoid = role === "buyer"
    ? "Pick up on time, or cancel more than 3 hours before your pickup."
    : "Answer buyers within 12 open hours, keep your listings exact, and do not cancel confirmed orders.";
  const dispute = "If an event is wrong, you can dispute it within 7 days.";
  const pause = role === "buyer" ? "You cannot reserve for now, but you can still browse and send messages." : "You cannot add listings or use Boost, but you can still serve your orders.";
  const text: Record<TrustLevel, string> = {
    good: `Nothing to do. ${avoid}`,
    notice: `Nothing is restricted. Read the notice and do not repeat it. ${avoid}`,
    warning: `Your account still works, but the next level is a pause. ${avoid} ${dispute}`,
    pause_24h: `${pause} Wait for the 24 hours to end, then you can use the account again. ${dispute}`,
    pause_3d: `${pause} Wait for the 3 days to end, then you can use the account again. ${dispute}`,
    block: "Your account is blocked. Open Account Recovery and enter the code we email you. Points fade 90 days after each event.",
  };
  return text[level];
}

/** The next level above the score, and how many points away it is. Null at the top. */
export function nextLevelFor(score: number, role: TrustRole) {
  const next = levelLadder(role).find((row) => row.fromPoints > score);
  return next ? { level: next.level, label: next.label, atPoints: next.fromPoints, pointsToGo: next.fromPoints - score } : null;
}
