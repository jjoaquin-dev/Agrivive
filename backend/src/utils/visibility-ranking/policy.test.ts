import { describe, expect, test } from "bun:test";
import { baselinePolicyVersion, resolveVisibilityPolicy, scoreTier } from "./policy";

// WSV-010 | Change VISIBILITY_POLICY and refresh the marketplace |
// Switches to the baseline without errors, and switching back restores AHP-TOPSIS.

describe("WSV-010 visibility policy switch", () => {
  test("visibility-v4 selects the baseline", () => {
    expect(resolveVisibilityPolicy("visibility-v4")).toBe(baselinePolicyVersion);
  });

  test("visibility-ahptopsis-v1 selects AHP-TOPSIS, ignoring spaces and capital letters", () => {
    expect(resolveVisibilityPolicy("visibility-ahptopsis-v1")).toBe("visibility-ahptopsis-v1");
    expect(resolveVisibilityPolicy("  Visibility-AHPTOPSIS-V1 ")).toBe("visibility-ahptopsis-v1");
  });

  test("Switching back and forth always returns the matching policy", () => {
    const sequence = ["visibility-v4", "visibility-ahptopsis-v1", "visibility-v4", "visibility-ahptopsis-v1"];
    expect(sequence.map(resolveVisibilityPolicy)).toEqual([
      "visibility-v4", "visibility-ahptopsis-v1", "visibility-v4", "visibility-ahptopsis-v1",
    ]);
  });

  test("A missing, empty or misspelled setting falls back to the baseline instead of failing", () => {
    for (const setting of [undefined, "", "   ", "visibility-ahptopsis", "ahp", "visibility-v5"]) {
      expect(resolveVisibilityPolicy(setting)).toBe(baselinePolicyVersion);
    }
  });

  test("Priority starts at 0.70 on the baseline and at 0.60 on AHP-TOPSIS", () => {
    expect(scoreTier(0.65, "visibility-v4")).toBe("standard");
    expect(scoreTier(0.7, "visibility-v4")).toBe("priority");
    expect(scoreTier(0.6, "visibility-ahptopsis-v1")).toBe("priority");
    expect(scoreTier(0.5999, "visibility-ahptopsis-v1")).toBe("standard");
  });

  test("Standard starts at 0.40 and a listing with no score has no tier, on both policies", () => {
    for (const policy of ["visibility-v4", "visibility-ahptopsis-v1"] as const) {
      expect(scoreTier(0.4, policy)).toBe("standard");
      expect(scoreTier(0.3999, policy)).toBe("basic");
      expect(scoreTier(null, policy)).toBeNull();
    }
  });
});
