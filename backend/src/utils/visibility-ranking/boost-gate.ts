import { loadEligibleVisibilityCandidates } from "./load";
import { rankVisibilityCandidates } from "./index";
import { decideBoostGate } from "./boost-gate.decision";

export async function checkPriorityBoostGate(productId: string, evaluatedAt = new Date()) {
  const candidates = await loadEligibleVisibilityCandidates(evaluatedAt);
  const productByCycle = new Map(candidates.map((candidate) => [candidate.id, candidate.productId]));
  const result = rankVisibilityCandidates(candidates).results.find((item) => productByCycle.get(item.id) === productId);
  return decideBoostGate(result);
}
