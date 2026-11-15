"use client";

import { useEffect, useState } from "react";

/** True on phone-width screens, where charts drop side titles, shorten labels and use smaller type. */
export function useCompactChart() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return compact;
}
