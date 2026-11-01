export type StartProblem =
  | { kind: "offline" }
  | { kind: "server" }
  | { kind: "paused"; reason: string; backIn: string | null }
  | { kind: "blocked"; reason: string };

/**
 * Turns the failed "load my account" call into one of the four problem screens.
 * 0 means the phone never got an answer, 408 is our own timeout, and 403 carries the reason the server wrote.
 */
export function classifyStartProblem(status: number, message: string | null): StartProblem {
  if (status === 0 || status === 408) return { kind: "offline" };
  if (status === 403) {
    const reason = message || "Your account is paused. Please restore your account to continue.";
    const backIn = /come back in (.+?)\.?$/i.exec(reason)?.[1] ?? null;
    return /restore your account/i.test(reason) || !backIn ? { kind: "blocked", reason } : { kind: "paused", reason, backIn };
  }
  return { kind: "server" };
}
