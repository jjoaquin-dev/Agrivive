import React from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { MessageCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { Conversation } from "../types";
import { ConversationListItem } from "./ConversationListItem";
import { ConversationSkeletonList } from "./ConversationSkeletonList";
import type { MessagesTabFilter } from "../hooks/useConversationFilters";

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  filterTab: MessagesTabFilter;
  searchQuery: string;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

export function ConversationList({
  conversations,
  loading,
  refreshing,
  loadingMore,
  error,
  filterTab,
  searchQuery,
  onRefresh,
  onLoadMore,
  onRetry,
}: ConversationListProps) {
  const router = useRouter();

  if (loading && conversations.length === 0) {
    return <ConversationSkeletonList />;
  }

  const renderEmpty = () => {
    if (error) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
          >
            <Text style={styles.retryBtnText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    if (searchQuery.trim()) {
      return (
        <View style={styles.centerBox}>
          <MessageCircle size={36} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No chats match "{searchQuery}".</Text>
        </View>
      );
    }

    if (filterTab === "unread") {
      return (
        <View style={styles.centerBox}>
          <MessageCircle size={36} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>You've read everything.</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerBox}>
        <MessageCircle size={36} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No messages yet</Text>
        <Text style={styles.emptySub}>
          When buyers ask about your produce, it shows here.
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.4}
      contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : undefined}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : undefined
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      renderItem={({ item }) => (
        <ConversationListItem
          conversation={item}
          onPress={() =>
            router.push({ pathname: "/(app)/conversations/[id]", params: { id: item.id } })
          }
        />
      )}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flexGrow: 1 },
  loader: { paddingVertical: spacing.md },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.md,
  },
  emptySub: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  errorText: {
    fontFamily: fonts.body.medium,
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  retryBtn: {
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtnPressed: { backgroundColor: colors.surfaceMuted },
  retryBtnText: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.text,
  },
});
