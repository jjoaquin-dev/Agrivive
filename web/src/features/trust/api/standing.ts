import { apiRequest } from "@/src/lib/api";

export type TrustLevelKey = "good" | "notice" | "warning" | "pause_24h" | "pause_3d" | "block";

export type TrustEvent = {
  id: string; kind: string; points: number; what: string; rule: string; createdAt: string;
  counted: boolean; disputeStatus: string | null; canDispute: boolean;
};

export type MyTrust = {
  score: number; level: TrustLevelKey; levelLabel: string; windowDays: number; pausedUntil: string | null;
  guidance: string; serious: string;
  nextLevel: { level: TrustLevelKey; label: string; atPoints: number; pointsToGo: number } | null;
  ladder: { level: TrustLevelKey; label: string; fromPoints: number; summary: string }[];
  events: TrustEvent[];
};

export function getMyTrust() {
  return apiRequest<MyTrust>("/trust/me");
}

export function disputeTrustEvent(eventId: string, reason: string) {
  return apiRequest<{ result: "upheld" | "rejected" | "unresolved"; because: string }>(`/trust/events/${eventId}/dispute`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
