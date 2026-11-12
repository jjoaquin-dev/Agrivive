import { describe, expect, test } from "bun:test";
import { trustActionReason } from "./action-reason";
import { blockedMessage, pausedMessage } from "./access";
import { reportViolationKinds } from "./confirm-report";
import { levelActionType, levelForScore, levelPauseHours, levelRank } from "./level";
import { describeEvent } from "./notice-text";
import { trustActionPolicy, trustAhp, trustPolicyWeights, trustScoreWindowDays, trustScoreWindowStart, trustSeriousKinds } from "./policy";

describe("trust levels (Table 3 ladder, cut-offs from the policy)", () => {
  // Each cut-off from the policy: one point below stays on the lower level, the cut-off itself moves up.
  const steps: [number, string, string][] = [
    [trustActionPolicy.noticeThreshold, "good", "notice"], [trustActionPolicy.warningThreshold, "notice", "warning"],
    [trustActionPolicy.tier1Threshold, "warning", "pause_24h"], [trustActionPolicy.tier2Threshold, "pause_24h", "pause_3d"],
    [trustActionPolicy.blockedThreshold, "pause_3d", "block"],
  ];
  for (const [cut, below, at] of steps) {
    test(`${cut - 1} points is ${below}, ${cut} points is ${at}`, () => {
      expect(levelForScore(cut - 1)).toBe(below as never);
      expect(levelForScore(cut)).toBe(at as never);
    });
  }
  test("0 points is good standing", () => expect(levelForScore(0)).toBe("good"));
  test("one serious violation blocks at any score", () => expect(levelForScore(0, true)).toBe("block"));
  test("pauses last 24 hours and 3 days, nothing else lasts", () => {
    expect(levelPauseHours("pause_24h")).toBe(24);
    expect(levelPauseHours("pause_3d")).toBe(72);
    expect(levelPauseHours("warning")).toBe(0);
    expect(levelActionType("good")).toBeNull();
    expect(levelActionType("notice")).toBe("notice");
    expect(levelActionType("block")).toBe("blocked");
  });
  test("levels only go up the ladder", () => {
    expect(levelRank("block")).toBeGreaterThan(levelRank("pause_3d"));
    expect(levelRank("pause_3d")).toBeGreaterThan(levelRank("pause_24h"));
    expect(levelRank("notice")).toBeGreaterThan(levelRank("good"));
  });
  test("the blocking level sits above the 3-day pause", () => {
    expect(trustActionPolicy.blockedThreshold).toBeGreaterThan(trustActionPolicy.tier2Threshold);
  });
});

describe("event weights (Tables 1 and 2)", () => {
  test("every weight comes from the AHP judgments", () => {
    expect(trustPolicyWeights).toEqual(trustAhp.points as typeof trustPolicyWeights);
  });
  test("thresholds are fractions of the total possible score and climb in order", () => {
    const p = trustActionPolicy;
    expect(p.totalPossible).toBe(Object.values(trustPolicyWeights).reduce((a, b) => a + b, 0));
    expect(p.noticeThreshold).toBeLessThan(p.warningThreshold);
    expect(p.warningThreshold).toBeLessThan(p.tier1Threshold);
    expect(p.tier1Threshold).toBeLessThan(p.tier2Threshold);
    expect(p.tier2Threshold).toBeLessThan(p.blockedThreshold);
  });
  test("QR misuse and an order from your own stall are the serious kinds", () => expect(trustSeriousKinds).toEqual(["qr_misuse", "self_order"]));
  test("only reasons that match a violation type can be confirmed by reports", () => {
    expect(reportViolationKinds).toEqual({ listing_inaccurate: "misleading_product_info", conduct: "inappropriate_communication", qr_misuse: "qr_misuse" });
  });
});

describe("trust messages", () => {
  test("a seller restricted for slow replies is not told about missed pickups", () => {
    const text = trustActionReason("temporary_restriction", "inquiry_non_response", "24 hours");
    expect(text).toContain("buyer questions");
    expect(text).not.toContain("picked up");
  });
  test("a block says how to restore, so the app shows it as blocked and not paused", () => {
    expect(blockedMessage("Account has been inactive for more than 30 days.")).toMatch(/restore your account/i);
  });
  test("a pause ends with the time left and never repeats an old one", () => {
    const text = pausedMessage("Your account is paused for 24 hours. Please come back in 24 hours.", new Date(Date.now() + 5 * 3_600_000));
    expect(text.match(/come back in/gi)?.length).toBe(1);
  });
  test("an event notice names the rule, the points, the level, how to avoid it and how to dispute", () => {
    const text = describeEvent({ kind: "seller_cancellation", weight: 2, score: 4, level: "warning" });
    for (const part of ["Rule:", "added 2 points", "score for the last 90 days is 4", "Warning", "How to avoid", "dispute it within 7 days"]) expect(text).toContain(part);
  });
  test("every missed pickup adds 2 points, with no free first miss", () => {
    const text = describeEvent({ kind: "buyer_failed_reservation", weight: 2, score: 2, level: "notice" });
    expect(text).toContain("added 2 points");
    expect(text).not.toContain("warning only");
  });
});

describe("score window", () => {
  test("events leave the score exactly 90 days after they happened", () => {
    const now = new Date("2026-11-02T00:00:00Z");
    expect(trustScoreWindowDays).toBe(90);
    expect(trustScoreWindowStart(now)?.getTime()).toBe(now.getTime() - 90 * 86_400_000);
  });
});
