import React, { useState } from "react";
import { View } from "react-native";
import { PriceDropHistoryList } from "./PriceDropHistoryList";
import { RunningPriceDropList } from "./RunningPriceDropList";

/** Price drops, apart from running boosts: the ones waiting for their next drop, then every lower price that was posted. */
export function PriceDropsSection({ refreshSignal }: { refreshSignal: number }) {
  const [changed, setChanged] = useState(0);
  return (
    <View>
      <RunningPriceDropList refreshSignal={refreshSignal} onChanged={() => setChanged((value) => value + 1)} />
      <PriceDropHistoryList refreshSignal={refreshSignal + changed} />
    </View>
  );
}
