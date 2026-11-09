const numberPattern = /\d[\d,]*(?:\.\d+)?/g;
const numbersIn = (text: string) => (text.match(numberPattern) ?? []).map((token) => Number(token.replace(/,/g, ""))).filter(Number.isFinite);

/** True only when every number in the written summary is one of the numbers we gave (rounding to a whole number or one decimal is fine). */
export function summaryUsesOnlyFacts(summary: string, facts: string): boolean {
  const allowed = numbersIn(facts);
  return numbersIn(summary).every((value) => allowed.some((fact) =>
    Math.abs(fact - value) < 0.005 || Math.round(fact) === value || Math.abs(Math.round(fact * 10) / 10 - value) < 0.005));
}
