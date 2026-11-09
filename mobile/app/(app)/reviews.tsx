import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../src/theme";
import { RatingSummaryCard } from "../../src/features/reviews/components/RatingSummaryCard";
import { ReviewFilterTabs } from "../../src/features/reviews/components/ReviewFilterTabs";
import { ReviewCard } from "../../src/features/reviews/components/ReviewCard";
import { useSellerReviews } from "../../src/features/reviews/hooks/useSellerReviews";

export default function SellerReviewsScreen() {
  const {
    summary,
    reviews,
    loading,
    refreshing,
    error,
    filter,
    setFilter,
    selectedRating,
    setSelectedRating,
    refresh,
    submitReply,
  } = useSellerReviews();

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading ratings & reviews...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <ButtonComponent
              title="Try Again"
              onPress={refresh}
              variant="secondary"
              style={styles.retryButton}
            />
          </View>
        ) : null}

        <RatingSummaryCard summary={summary} />

        <ReviewFilterTabs
          currentFilter={filter}
          onSelectFilter={setFilter}
          unansweredCount={summary.unansweredCount}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
        />

        {reviews.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Star size={24} color="#D97706" />
            </View>
            <Text style={styles.emptyTitle}>No reviews found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === "unanswered"
                ? "You have replied to all customer feedback!"
                : "Customer reviews and feedback will appear here after orders are collected."}
            </Text>
          </View>
        ) : (
          reviews.map((item) => (
            <ReviewCard
              key={item.id}
              review={item}
              onSubmitReply={submitReply}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.base,
  },
  loadingText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: radii.card,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  errorText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.sm,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
  },
  emptySubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 260,
  },
});
