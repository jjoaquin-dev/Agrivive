import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Check, CornerDownRight, MessageSquare, Star } from "lucide-react-native";
import type { ReviewItem } from "../types";
import { ReviewReplyComposer } from "./ReviewReplyComposer";
import { styles } from "./review-card.styles";

interface ReviewCardProps {
  review: ReviewItem;
  onSubmitReply: (reviewId: string, reply: string) => Promise<void>;
}

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} color="#EAB308" fill={s <= value ? "#EAB308" : "transparent"} />
    ))}
  </View>
);

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onSubmitReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Date(review.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      setError("Please write a reply before sending.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmitReply(review.id, replyText.trim());
      setIsReplying(false);
      setReplyText("");
    } catch (err: any) {
      setError(err?.message || "Failed to submit reply.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.buyerInfo}>
          <Text style={styles.buyerName}>{review.buyerName}</Text>
          <View style={styles.verifiedBadge}>
            <Check size={10} color="#457D00" strokeWidth={3} />
            <Text style={styles.verifiedText}>Verified Buyer</Text>
          </View>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.ratingLine}>
        <Text style={styles.ratingLabel}>Seller</Text>
        <Stars value={review.serviceRating ?? review.rating} />
      </View>
      {review.productRating ? (
        <View style={styles.ratingLine}>
          <Text style={styles.ratingLabel}>Produce</Text>
          <Stars value={review.productRating} />
        </View>
      ) : null}

      {review.items && review.items.length > 0 ? (
        <View style={styles.itemsWrap}>
          {review.items.map((item, idx) => (
            <View key={idx} style={styles.itemTag}>
              <Text style={styles.itemTagText}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {review.review ? (
        <Text style={styles.reviewText}>{review.review}</Text>
      ) : (
        <Text style={styles.noCommentText}>No written comment</Text>
      )}

      {review.photoUrl ? (
        <Image source={{ uri: review.photoUrl }} style={styles.reviewPhoto} accessibilityLabel="Photo from the buyer" />
      ) : null}

      {review.sellerResponse ? (
        <View style={styles.responseBox}>
          <View style={styles.responseHeader}>
            <CornerDownRight size={14} color="#457D00" />
            <Text style={styles.responseTitle}>Your reply</Text>
          </View>
          <Text style={styles.responseText}>{review.sellerResponse}</Text>
        </View>
      ) : isReplying ? (
        <ReviewReplyComposer
          replyText={replyText}
          onChangeText={(txt) => {
            setReplyText(txt);
            if (error) setError(null);
          }}
          submitting={submitting}
          error={error}
          onCancel={() => {
            setIsReplying(false);
            setReplyText("");
            setError(null);
          }}
          onSend={handleSendReply}
        />
      ) : (
        <Pressable
          onPress={() => setIsReplying(true)}
          style={styles.replyBtn}
          accessibilityRole="button"
          accessibilityLabel="Reply to this review"
        >
          <MessageSquare size={14} color="#457D00" />
          <Text style={styles.replyBtnText}>Reply</Text>
        </Pressable>
      )}
    </View>
  );
};
