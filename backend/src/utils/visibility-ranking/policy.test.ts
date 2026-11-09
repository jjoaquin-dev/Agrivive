import { describe, expect, test } from "bun:test";
import { baselinePolicyVersion, resolveVisibilityPolicy } from "./policy";

// WSV-010 | Change VISIBILITY_POLICY and refresh the marketplace |
// Rolls back to the baseline without errors, and switching back restores AHP-TOPSIS. AHP-TOPSIS is the default.

describe("WSV-010 visibility policy switch", () => {
  test("visibility-v4 rolls back to the baseline, ignoring spaces and capital letters", () => {
    expect(resolveVisibilityPolicy("visibility-v4")).toBe(baselinePolicyVersion);
    expect(resolveVisibilityPolicy("  Visibility-V4 ")).toBe(baselinePolicyVersion);
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

  test("A missing, empty or unknown setting uses AHP-TOPSIS instead of failing", () => {
    for (const setting of [undefined, "", "   ", "visibility-ahptopsis", "ahp", "visibility-v5"]) {
      expect(resolveVisibilityPolicy(setting)).toBe("visibility-ahptopsis-v1");
    }
  });
});
