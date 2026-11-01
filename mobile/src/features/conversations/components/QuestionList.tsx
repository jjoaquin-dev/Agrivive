import React from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { MessageSquare } from "lucide-react-native";
import { colors } from "../../../theme";
import type { SellerMessageFilter, SellerProductInquiryItem } from "../../messages/types";
import { QuestionCard } from "../../messages/components/QuestionCard";
import { styles } from "./QuestionListStyles";

interface QuestionListProps {
  inquiries: SellerProductInquiryItem[];
  openCount: number;
  filter: SellerMessageFilter;
  onChangeFilter: (filter: SellerMessageFilter) => void;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  replyingId: string | null;
  error: string | null;
  onRefresh: () => void;
  onLoadMore: () => void;
  onReply: (id: string, text: string) => Promise<void>;
  onAnswerSuccess: () => void;
  onRetry: () => void;
}

export function QuestionList({
  inquiries,
  openCount,
  filter,
  onChangeFilter,
  loading,
  refreshing,
  loadingMore,
  replyingId,
  error,
  onRefresh,
  onLoadMore,
  onReply,
  onAnswerSuccess,
  onRetry,
}: QuestionListProps) {
  const renderHeader = () => (
    <View style={styles.headerBox}>
      <Text style={styles.infoLine}>
        Questions buyers asked on your product page. Your answer shows there and in your chat.
      </Text>

      <View style={styles.segmentedRow}>
        <Pressable
          onPress={() => onChangeFilter("open")}
          accessibilityRole="tab"
          accessibilityState={{ selected: filter === "open" }}
          style={[styles.segmentBtn, filter === "open" && styles.segmentBtnActive]}
        >
          <Text style={[styles.segmentText, filter === "open" && styles.segmentTextActive]}>
            Waiting {openCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onChangeFilter("all")}
          accessibilityRole="tab"
          accessibilityState={{ selected: filter === "all" }}
          style={[styles.segmentBtn, filter === "all" && styles.segmentBtnActive]}
        >
          <Text style={[styles.segmentText, filter === "all" && styles.segmentTextActive]}>
            All
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

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

    return (
      <View style={styles.centerBox}>
        <MessageSquare size={36} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>
          {filter === "open" ? "No questions waiting" : "No questions yet"}
        </Text>
        <Text style={styles.emptySub}>
          {filter === "open"
            ? "You've answered all questions from buyers."
            : "Questions asked on your produce pages show here."}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={inquiries}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContent}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null
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
        <QuestionCard
          inquiry={item}
          onReply={onReply}
          isReplying={replyingId === item.id}
          onAnswerSuccess={onAnswerSuccess}
        />
      )}
      ListEmptyComponent={renderEmpty}
    />
  );
}
