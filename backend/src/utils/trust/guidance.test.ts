import { describe, expect, test } from "bun:test";
import { levelGuidance, levelLadder, nextLevelFor } from "./guidance";
import { trustActionPolicy } from "./policy";

describe("trust guidance", () => {
  test("the ladder climbs and starts at the policy cut-offs", () => {
    const ladder = levelLadder("buyer");
    expect(ladder.map((row) => row.level)).toEqual(["good", "notice", "warning", "pause_24h", "pause_3d", "block"]);
    expect(ladder.map((row) => row.fromPoints)).toEqual([0, trustActionPolicy.noticeThreshold, trustActionPolicy.warningThreshold, trustActionPolicy.tier1Threshold, trustActionPolicy.tier2Threshold, trustActionPolicy.blockedThreshold]);
  });
  test("next level is the first cut-off above the score and is null at the top", () => {
    expect(nextLevelFor(0, "buyer")).toMatchObject({ level: "notice", pointsToGo: trustActionPolicy.noticeThreshold });
    expect(nextLevelFor(trustActionPolicy.noticeThreshold, "seller")).toMatchObject({ level: "warning" });
    expect(nextLevelFor(trustActionPolicy.blockedThreshold + 5, "buyer")).toBeNull();
  });
  test("a pause tells the person to wait, a block tells them to use recovery, and neither promises a code lifts a pause", () => {
    expect(levelGuidance("pause_24h", "buyer")).toContain("Wait for the 24 hours");
    expect(levelGuidance("pause_24h", "buyer")).not.toMatch(/email code|recovery/i);
    expect(levelGuidance("block", "seller")).toContain("Account Recovery");
  });
  test("buyers and sellers get their own words", () => {
    expect(levelGuidance("good", "buyer")).toContain("Pick up on time");
    expect(levelGuidance("good", "seller")).toContain("Answer buyers");
    expect(levelLadder("seller")[3]!.summary).toContain("Boost");
  });
});
