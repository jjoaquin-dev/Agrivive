import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { MessageCircle, Star } from "lucide-react-native";
import { ApiError } from "../../../api/client";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { CardComponent } from "../../../components/CardComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import {
  fetchSellerInquiries,
  fetchSellerReview,
  replyToSellerInquiry,
  respondToSellerReview,
  type SellerInquiry,
  type SellerReview,
} from "../api/seller-communication";

export function SellerOrderCommunication({ orderId }: { orderId: string }) {
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [review, setReview] = useState<SellerReview | null>(null);
  const [reply, setReply] = useState("");
  const [response, setResponse] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingReply, setSavingReply] = useState(false);
  const [savingResponse, setSavingResponse] = useState(false);

  const loadCommunication = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const loadedInquiries = await fetchSellerInquiries(orderId);
      let loadedReview: SellerReview | null = null;
      try {
        loadedReview = await fetchSellerReview(orderId);
      } catch (error) {
        if (!(error instanceof ApiError) || error.statusCode !== 404) throw error;
      }
      setInquiries(loadedInquiries);
      setReview(loadedReview);
    } catch (error: any) {
      setLoadError(error?.message || "Could not load buyer communication.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(useCallback(() => {
    void loadCommunication();
  }, [loadCommunication]));

  const submitReply = async () => {
    const openInquiry = inquiries.find((inquiry) => !inquiry.repliedAt);
    if (!openInquiry) return;
    if (!reply.trim()) {
      setReplyError("Write a reply before sending.");
      return;
    }
    setSavingReply(true);
    setReplyError(null);
    try {
      const updated = await replyToSellerInquiry(openInquiry.id, reply.trim());
      setInquiries((previous) => previous.map((item) => item.id === updated.id ? updated : item));
      setReply("");
    } catch (error: any) {
      setReplyError(error?.message || "Could not send the reply.");
    } finally {
      setSavingReply(false);
    }
  };

  const submitResponse = async () => {
    if (!review || review.sellerResponse) return;
    if (!response.trim()) {
      setResponseError("Write a response before sending.");
      return;
    }
    setSavingResponse(true);
    setResponseError(null);
    try {
      setReview(await respondToSellerReview(orderId, response.trim()));
      setResponse("");
    } catch (error: any) {
      setResponseError(error?.message || "Could not send the response.");
    } finally {
      setSavingResponse(false);
    }
  };

  return (
    <CardComponent style={styles.card}>
      <View style={styles.headingRow}>
        <MessageCircle size={19} color={colors.primary} />
        <Text style={styles.heading}>Buyer communication</Text>
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.muted}>Loading messages...</Text>
        </View>
      ) : loadError ? (
        <View>
          <Text style={styles.errorText}>{loadError}</Text>
          <ButtonComponent title="Try Again" onPress={loadCommunication} variant="secondary" style={styles.retryButton} />
        </View>
      ) : (
        <>
          {inquiries.length === 0 ? (
            <Text style={styles.muted}>No buyer questions for this order.</Text>
          ) : (
            <View>
              {inquiries.map((inquiry) => (
                <View key={inquiry.id} style={styles.inquiryBlock}>
                  <Text style={styles.label}>Buyer question</Text>
                  <Text style={styles.message}>{inquiry.question}</Text>
                  {inquiry.reply ? (
                    <View style={styles.replyBox}>
                      <Text style={styles.label}>Your reply</Text>
                      <Text style={styles.message}>{inquiry.reply}</Text>
                    </View>
                  ) : (
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Reply to buyer</Text>
                      <TextInput
                        value={reply}
                        onChangeText={(value) => { setReply(value); setReplyError(null); }}
                        placeholder="Write a clear answer"
                        placeholderTextColor={colors.textMuted}
                        multiline
                        accessibilityLabel="Reply to buyer"
                        style={[styles.input, replyError && styles.inputError]}
                      />
                      {replyError ? <Text style={styles.fieldError}>{replyError}</Text> : null}
                      <ButtonComponent title="Send Reply" onPress={submitReply} loading={savingReply} style={styles.formButton} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.divider} />
          <Text style={styles.label}>Buyer review</Text>
          {!review ? (
            <Text style={styles.muted}>No review has been posted for this order.</Text>
          ) : (
            <View>
              <View style={styles.ratingRow}>
                <Star size={17} color={colors.warning} fill={colors.warning} />
                <Text style={styles.ratingText}>{review.rating} out of 5</Text>
              </View>
              {review.review ? <Text style={styles.message}>{review.review}</Text> : null}
              {review.sellerResponse ? (
                <View style={styles.replyBox}>
                  <Text style={styles.label}>Your response</Text>
                  <Text style={styles.message}>{review.sellerResponse}</Text>
                </View>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Respond to review</Text>
                  <TextInput
                    value={response}
                    onChangeText={(value) => { setResponse(value); setResponseError(null); }}
                    placeholder="Thank the buyer or clarify the handover"
                    placeholderTextColor={colors.textMuted}
                    multiline
                    accessibilityLabel="Respond to buyer review"
                    style={[styles.input, responseError && styles.inputError]}
                  />
                  {responseError ? <Text style={styles.fieldError}>{responseError}</Text> : null}
                  <ButtonComponent title="Send Response" onPress={submitResponse} loading={savingResponse} style={styles.formButton} />
                </View>
              )}
            </View>
          )}
        </>
      )}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.base },
  inquiryBlock: { marginBottom: spacing.md },
  headingRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  heading: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text, marginLeft: spacing.sm },
  loadingRow: { flexDirection: "row", alignItems: "center" },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  label: { fontFamily: fonts.body.semiBold, fontSize: 14, lineHeight: 20, color: colors.text, marginBottom: spacing.xs },
  message: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 21, color: colors.text },
  replyBox: { backgroundColor: colors.background, borderRadius: radii.input, padding: spacing.md, marginTop: spacing.md },
  formGroup: { marginTop: spacing.md },
  input: { minHeight: touchTargets.min * 2, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: spacing.md, color: colors.text, fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, textAlignVertical: "top", backgroundColor: colors.surface },
  inputError: { borderColor: colors.error },
  fieldError: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error, marginTop: spacing.xs },
  formButton: { marginTop: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  ratingText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, marginLeft: spacing.xs },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retryButton: { marginTop: spacing.sm },
});
