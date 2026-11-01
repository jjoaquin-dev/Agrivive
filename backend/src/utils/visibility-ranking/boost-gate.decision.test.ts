import { describe, expect, test } from "bun:test";
import { decideBoostGate } from "./boost-gate.decision";

// Boost status per the paper: only Priority Boost (0.60 or higher) listings can boost.

describe("Boost gate", () => {
  test("A Priority Boost listing can boost", () => {
    expect(decideBoostGate({ tier: "Priority Boost", score: 0.78 })).toEqual({ allowed: true, tier: "Priority Boost", score: 0.78 });
  });

  test("A Standard Exposure listing cannot boost and is told its tier", () => {
    const gate = decideBoostGate({ tier: "Standard Exposure", score: 0.5 });
    expect(gate.allowed).toBe(false);
    if (!gate.allowed) {
      expect(gate.headline).toBe("Priority Boost Needed");
      expect(gate.message).toBe("Boost opens at Priority Boost. This listing is Standard Exposure right now.");
    }
  });

  test("A Basic/Hold listing cannot boost and is told its tier", () => {
    const gate = decideBoostGate({ tier: "Basic/Hold", score: 0.1 });
    expect(gate.allowed).toBe(false);
    if (!gate.allowed) expect(gate.message).toContain("Basic/Hold");
  });

  test("A listing that is not ranked yet cannot boost", () => {
    const gate = decideBoostGate(undefined);
    expect(gate.allowed).toBe(false);
    if (!gate.allowed) expect(gate.headline).toBe("Not Ranked Yet");
  });
});
