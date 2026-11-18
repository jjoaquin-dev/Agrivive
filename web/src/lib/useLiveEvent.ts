"use client";

import { useEffect, useRef } from "react";
import { subscribeLive, type LiveEvent } from "./liveEvents";

type Options = {
  enabled: boolean;
  match: (event: LiveEvent) => boolean;
  needsUser?: boolean;
  feed?: boolean;
};

/** Calls `reload` shortly after a matching live event. Several events close together cause one reload. */
export function useLiveEvent(reload: () => void, { enabled, match, needsUser = false, feed = false }: Options) {
  const reloadRef = useRef(reload);
  const matchRef = useRef(match);
  reloadRef.current = reload;
  matchRef.current = match;

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = subscribeLive({
      needsUser,
      feed,
      handler: (event) => {
        if (!matchRef.current(event) || timer) return;
        timer = setTimeout(() => {
          timer = undefined;
          reloadRef.current();
        }, 800);
      },
    });
    return () => {
      if (timer) clearTimeout(timer);
      stop();
    };
  }, [enabled, needsUser, feed]);
}
