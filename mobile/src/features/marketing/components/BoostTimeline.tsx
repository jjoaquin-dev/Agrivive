import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";
import { formatBoostTime, type BoostProgress } from "../types";

interface Props {
  progress: BoostProgress;
  /** Show only the newest posts. */
  limit?: number;
}

/** One row per Facebook post, then the next price drop. Rows are joined by a line (Uniform Connectedness, Gestalt). */
export function BoostTimeline({ progress, limit }: Props) {
  const posts = limit ? progress.posts.slice(-limit) : progress.posts;
  const hidden = progress.posts.length - posts.length;
  const rows = [
    ...posts.map((post, index) => ({
      key: `${post.postedAt}-${index}`,
      title: post.type === "first_post" && hidden === 0 && index === 0 ? "Posted" : "Price drop posted",
      detail: `₱${post.price.toFixed(2)} · ${formatBoostTime(post.postedAt)}`,
      url: post.postUrl,
      done: true,
    })),
    ...(progress.nextDropAt
      ? [{ key: "next", title: "Next price drop", detail: formatBoostTime(progress.nextDropAt), url: null, done: false }]
      : []),
  ];
  if (rows.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {hidden > 0 ? <Text style={styles.more}>{hidden} earlier {hidden === 1 ? "post" : "posts"}</Text> : null}
      {rows.map((row, index) => (
        <View key={row.key} style={styles.row}>
          <View style={styles.rail}>
            <View style={[styles.dot, row.done ? styles.dotDone : styles.dotNext]} />
            {index < rows.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{row.title}</Text>
            <Text style={styles.detail}>{row.detail}</Text>
            {row.url ? (
              <Pressable onPress={() => void Linking.openURL(row.url!)} accessibilityRole="link" style={styles.link}>
                <Text style={styles.linkText}>View post on Facebook</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  more: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs },
  row: { flexDirection: "row", gap: spacing.sm },
  rail: { width: 14, alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  dotDone: { backgroundColor: colors.success },
  dotNext: { backgroundColor: colors.background, borderWidth: 2, borderColor: colors.primary },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  copy: { flex: 1, paddingBottom: spacing.sm },
  title: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text },
  detail: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 1 },
  link: { minHeight: 32, justifyContent: "center", alignSelf: "flex-start" },
  linkText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
});
