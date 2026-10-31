import { getSellerNoticeDef, sellerNoticePath } from "./messages";

type AlertPayload = Record<string, unknown>;

function countsOf(payload: AlertPayload) {
  const counts = (payload.counts ?? {}) as Record<string, number>;
  return Object.entries(counts).filter(([kind]) => getSellerNoticeDef(kind));
}

/** Words for one seller phone alert. Several events in one window are combined. */
export function sellerAlertContent(payload: AlertPayload, itemCount: number, referenceId: string | null) {
  const kind = String(payload.kind ?? "");
  const def = getSellerNoticeDef(kind);
  const channel = payload.channel === "updates" ? "updates" : "orders";
  if (!def) {
    return { title: "Agrivive update", body: "Open Agrivive to see what is new.", path: "/(app)/notifications", channel };
  }
  if (itemCount <= 1) {
    return {
      title: def.title,
      body: def.body(payload),
      path: sellerNoticePath(def.target, referenceId),
      channel,
    };
  }
  if (channel === "orders") {
    return {
      title: `${itemCount} ${def.plural}`,
      body: "Open Agrivive to see them.",
      path: "/(app)/notifications",
      channel,
    };
  }
  const parts = countsOf(payload).map(([countKind, count]) =>
    `${count > 1 ? `${count} ` : ""}${count > 1 ? getSellerNoticeDef(countKind)!.plural : getSellerNoticeDef(countKind)!.title}`);
  return { title: `${itemCount} Updates`, body: parts.join(" · "), path: "/(app)/notifications", channel };
}
