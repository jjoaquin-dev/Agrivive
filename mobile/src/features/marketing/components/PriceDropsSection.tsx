import React from "react";
import { View } from "react-native";
import { PriceDropHistoryList } from "./PriceDropHistoryList";
import { RunningPriceDropList } from "./RunningPriceDropList";

/** Price drops, apart from running boosts: the ones waiting for their next drop, then every lower price that was posted. */
export function PriceDropsSection({ refreshSignal }: { refreshSignal: number }) {
  return (
    <View>
      <RunningPriceDropList refreshSignal={refreshSignal} />
      <PriceDropHistoryList refreshSignal={refreshSignal} />
    </View>
  );
}
