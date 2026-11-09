import React, { useState } from "react";
import { Pressable } from "react-native";
import { AnalyticsDetailSheet, type BreakdownRow } from "./AnalyticsDetailSheet";

/** Makes a report card pressable: pressing it opens the breakdown behind the numbers. */
export function AnalyticsTapCard({ title, subtitle, rows, children }: { title: string; subtitle?: string; rows: BreakdownRow[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={`${title}. Shows the breakdown`}>{children}</Pressable>
      <AnalyticsDetailSheet visible={open} title={title} subtitle={subtitle} rows={rows} onClose={() => setOpen(false)} />
    </>
  );
}
