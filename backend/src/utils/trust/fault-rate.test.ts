import { describe, expect, test } from "bun:test";
import { computeFaultRate, faultGateMet, needsReview } from "./fault-rate";
import { bayesianRating, isTrustedSeller } from "./rating";

describe("seller fault rate (Equation 2)", () => {
  test("F is faults divided by orders, as a percent", () => {
    expect(computeFaultRate(2, 10)).toBe(20);
    expect(computeFaultRate(3, 12)).toBe(25);
    expect(computeFaultRate(4, 14)).toBeCloseTo(28.571, 2);
    expect(computeFaultRate(3, 500)).toBeCloseTo(0.6, 5);
    expect(computeFaultRate(1, 0)).toBe(0);
  });
  test("the gate needs at least 10 orders: 9 orders never meet it, exactly 10 can", () => {
    expect(faultGateMet(9, 50)).toBe(false);
    expect(faultGateMet(10, 50)).toBe(true);
  });
  test("exactly 10% meets the gate, 9.9% does not", () => {
    expect(faultGateMet(10, computeFaultRate(1, 10))).toBe(true);
    expect(faultGateMet(1000, computeFaultRate(99, 1000))).toBe(false);
    expect(faultGateMet(1000, computeFaultRate(100, 1000))).toBe(true);
  });
  test("exactly 15% needs review, 14.9% does not, fewer than 10 orders never does", () => {
    expect(needsReview(100, computeFaultRate(15, 100))).toBe(true);
    expect(needsReview(1000, computeFaultRate(149, 1000))).toBe(false);
    expect(needsReview(9, 100)).toBe(false);
  });
});

describe("seller rating (Equation 3)", () => {
  test("a new seller with two 5-star reviews is 4.29 when the market average is 4.0", () => {
    expect(bayesianRating(10, 2, 4.0)).toBeCloseTo(4.2857, 3);
  });
  test("a seller with 40 reviews averaging 4.6 is 4.53", () => {
    expect(bayesianRating(184, 40, 4.0)).toBeCloseTo(4.5333, 3);
  });
  test("no reviews gives the marketplace average", () => expect(bayesianRating(0, 0, 4.0)).toBe(4));
  test("it is not a simple average", () => expect(bayesianRating(10, 2, 4.0)).not.toBe(5));
});

describe("Trusted Seller badge", () => {
  const base = { rating: 4.5, score: 0, completedOrders: 20, faultRatePercent: 14.9 };
  test("exactly 4.5, 20 orders, score 0 and a rate below 15% qualifies", () => expect(isTrustedSeller(base)).toBe(true));
  test("4.49 does not", () => expect(isTrustedSeller({ ...base, rating: 4.49 })).toBe(false));
  test("19 completed orders do not", () => expect(isTrustedSeller({ ...base, completedOrders: 19 })).toBe(false));
  test("any point in the last 90 days does not", () => expect(isTrustedSeller({ ...base, score: 1 })).toBe(false));
  test("a fault rate of exactly 15% does not", () => expect(isTrustedSeller({ ...base, faultRatePercent: 15 })).toBe(false));
});
