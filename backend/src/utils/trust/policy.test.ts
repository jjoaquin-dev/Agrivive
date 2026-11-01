import { describe, expect, test } from "bun:test";
import { trustActionReason } from "./action-reason";
import { blockedMessage, pausedMessage } from "./access";
import { reportViolationKinds } from "./confirm-report";
import { resolveTrustAction, resolveTrustDurationHours, trustActionPolicy, trustPolicyWeights, trustScoreWindowDays, trustScoreWindowStart, trustSeriousKinds } from "./policy";

describe("trust policy (Table 18)", () => {
  test("no action below the warning level", () => {
    expect(resolveTrustAction(0)).toBeNull();
    expect(resolveTrustAction(trustActionPolicy.warningThreshold - 1)).toBeNull();
  });

  test("warning, then temporary restriction, then blocking as the score grows", () => {
    expect(resolveTrustAction(trustActionPolicy.warningThreshold)).toBe("warning");
    expect(resolveTrustAction(trustActionPolicy.tier1Threshold)).toBe("temporary_restriction");
    expect(resolveTrustAction(trustActionPolicy.tier3Threshold)).toBe("temporary_restriction");
    expect(resolveTrustAction(trustActionPolicy.blockedThreshold)).toBe("blocked");
  });

  test("the blocking level sits above the last restriction tier", () => {
    expect(trustActionPolicy.blockedThreshold).toBeGreaterThan(trustActionPolicy.tier3Threshold);
    expect(resolveTrustDurationHours(trustActionPolicy.tier3Threshold)).toBe(72);
  });

  test("a serious violation blocks the account at any score", () => {
    expect(resolveTrustAction(0, true)).toBe("blocked");
  });

  test("every violation kind that can be confirmed has a weight, and serious kinds are weighted", () => {
    for (const kind of Object.values(reportViolationKinds)) expect(trustPolicyWeights[kind as keyof typeof trustPolicyWeights]).toBeGreaterThan(0);
    for (const kind of trustSeriousKinds) expect(trustPolicyWeights[kind as keyof typeof trustPolicyWeights]).toBeGreaterThan(0);
  });
});

describe("trust messages", () => {
  test("a seller restricted for slow replies is not told about missed pickups", () => {
    const text = trustActionReason("temporary_restriction", "inquiry_non_response", "24 hours");
    expect(text).toContain("buyer questions");
    expect(text).not.toContain("picked up");
  });

  test("a buyer who missed a pickup still gets the pickup message", () => {
    expect(trustActionReason("temporary_restriction", "buyer_failed_reservation", "12 hours")).toContain("not picked up");
    expect(trustActionReason("warning", "buyer_failed_reservation", "12 hours")).toContain("missed pickups");
  });

  test("unknown causes still give a plain message", () => {
    expect(trustActionReason("temporary_restriction", undefined, "12 hours")).toContain("12 hours");
    expect(trustActionReason("warning", null, "12 hours").length).toBeGreaterThan(10);
  });

  test("a pause ends with the time left and never repeats an old one", () => {
    const endsAt = new Date(Date.now() + 5 * 3_600_000);
    const text = pausedMessage("Your account is paused for 12 hours. Please come back in 12 hours.", endsAt);
    expect(text.match(/come back in/gi)?.length).toBe(1);
    expect(text).toMatch(/Please come back in \d+ hours?\.$/);
  });

  test("a block says how to restore, so the app shows it as blocked and not paused", () => {
    expect(blockedMessage("Account has been inactive for more than 30 days.")).toMatch(/restore your account/i);
    expect(blockedMessage(trustActionReason("blocked", "qr_misuse", "12 hours"))).not.toMatch(/come back in/i);
  });
});

describe("report confirmation", () => {
  test("only reasons that match a violation type in the paper can be confirmed", () => {
    expect(reportViolationKinds.listing_inaccurate).toBe("misleading_product_info");
    expect(reportViolationKinds.conduct).toBe("inappropriate_communication");
    expect(reportViolationKinds.qr_misuse).toBe("qr_misuse");
    expect(reportViolationKinds.other).toBeUndefined();
    expect(reportViolationKinds.pickup_problem).toBeUndefined();
  });
});

describe("score window", () => {
  test("old violations stop counting after the window", () => {
    const now = new Date("2026-11-02T00:00:00Z");
    const start = trustScoreWindowStart(now);
    if (trustScoreWindowDays > 0) {
      expect(start?.getTime()).toBe(now.getTime() - trustScoreWindowDays * 86_400_000);
    } else {
      expect(start).toBeNull();
    }
  });
});
