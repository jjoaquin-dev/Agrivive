function centsFromDecimal(value: string) {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) throw new Error("Invalid monetary amount");
  return BigInt(match[1]) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
}

function decimalFromCents(cents: bigint) {
  return `${cents / 100n}.${(cents % 100n).toString().padStart(2, "0")}`;
}

export function quantityToHundredths(quantity: number): bigint | null {
  if (!Number.isFinite(quantity) || quantity < 0.01 || quantity > 99_999_999) {
    return null;
  }

  const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(String(quantity));
  if (!match) return null;

  return (
    BigInt(match[1]) * 100n +
    BigInt((match[2] ?? "").padEnd(2, "0"))
  );
}

export function priceToCents(price: number): bigint | null {
  if (!Number.isFinite(price) || price < 1 || price > 99_999_999.99) return null;
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(String(price));
  if (!match) return null;
  return BigInt(match[1]) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
}

export function multiplyPrice(price: string, quantity: number) {
  const hundredths = quantityToHundredths(quantity);
  if (hundredths === null) throw new Error("Invalid quantity");

  return decimalFromCents(
    (centsFromDecimal(price) * hundredths + 50n) / 100n,
  );
}

export function sumAmounts(amounts: string[]) {
  return decimalFromCents(
    amounts.reduce((total, amount) => total + centsFromDecimal(amount), 0n),
  );
}
