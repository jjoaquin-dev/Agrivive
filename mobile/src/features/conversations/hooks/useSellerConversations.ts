import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchConversations } from "../api";
import type { Conversation } from "../types";

export function useSellerConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setConversations(await fetchConversations());
    } catch (reason: any) {
      setError(reason?.message || "Could not load conversations. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  const refresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  return { conversations, loading, refreshing, error, refresh };
}
