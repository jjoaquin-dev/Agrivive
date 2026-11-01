import React from "react";
import { PriceDropHistoryList } from "./PriceDropHistoryList";

/** Every lower price that was posted. The on/off switches live behind the Settings button. */
export function PriceDropsSection({ refreshSignal }: { refreshSignal: number }) {
  return <PriceDropHistoryList refreshSignal={refreshSignal} />;
}
