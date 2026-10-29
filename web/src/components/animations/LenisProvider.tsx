"use client";

import React from "react";
import { useLenis } from "@/src/hooks/useLenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useLenis();
  return <>{children}</>;
}
