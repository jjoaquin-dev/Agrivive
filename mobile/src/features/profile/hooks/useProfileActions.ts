import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchStall, setClosedToday } from "../../orders/api/seller-pickup";
import { fetchSellerReviewsList } from "../../reviews/api/seller-reviews";

/** The two things a seller may need to do right now: close the store for today, and answer reviews. Reloads each time the page opens. */
export function useProfileActions() {
  const [closedToday, setClosed] = useState<boolean | null>(null);
  const [toReply, setToReply] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  useFocusEffect(useCallback(() => {
    let live = true;
    fetchStall().then((stall) => { if (live) setClosed(stall.closedToday); }).catch(() => { if (live) setFailed(true); });
    fetchSellerReviewsList({ limit: 1 }).then((res) => { if (live) setToReply(res.summary.unansweredCount); }).catch(() => undefined);
    return () => { live = false; };
  }, []));

  const toggleClosed = useCallback(async (next: boolean) => {
    setSaving(true);
    setClosed(next); // show it at once, put it back if the server says no
    try { await setClosedToday(next); setFailed(false); } catch { setClosed(!next); setFailed(true); } finally { setSaving(false); }
  }, []);

  return { closedToday, toReply, saving, failed, toggleClosed };
}
