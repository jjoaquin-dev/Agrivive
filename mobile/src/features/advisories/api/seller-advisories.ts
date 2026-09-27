import { apiFetch } from "../../../api/client";
import type { SellerAdvisoriesResponse } from "../types";

export function fetchSellerAdvisories() {
  return apiFetch<SellerAdvisoriesResponse>("/seller/advisories");
}
