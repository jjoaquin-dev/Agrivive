import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { colors, fonts, spacing } from "../../../src/theme";
import { SocialCampaignReview } from "../../../src/features/boost/components/SocialCampaignReview";
import {
  createSocialDraft, fetchSocialCampaign, fetchSocialChannels, publishSocialDraft, retrySocialDraft,
  type CampaignStatus, type SocialChannel, type SocialPlatform,
} from "../../../src/features/boost/api/social-campaigns";

export default function BoostVisibilityScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [selected, setSelected] = useState<SocialPlatform[]>([]);
  const [draft, setDraft] = useState<{ campaignId: string; productName: string; imageUrl: string | null } | null>(null);
  const [campaign, setCampaign] = useState<CampaignStatus | null>(null);
  const [posts, setPosts] = useState<Partial<Record<SocialPlatform, string>>>({});
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [draftLoading, setDraftLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const requestInFlight = useRef(false);
  const initializedSelection = useRef(false);

  const loadChannels = useCallback(async () => {
    setChannelsLoading(true);
    setError("");
    try {
      const result = await fetchSocialChannels();
      setChannels(result.channels);
      if (!initializedSelection.current) {
        setSelected(result.channels.filter((channel) => channel.configured).map((channel) => channel.platform));
        initializedSelection.current = true;
      } else {
        setSelected((current) => current.filter((platform) => result.channels.some((channel) => channel.platform === platform && channel.configured)));
      }
    } catch (reason: any) {
      setError(reason?.message || "Could not load Agrivive channels.");
    } finally {
      setChannelsLoading(false);
    }
  }, []);

  useEffect(() => { void loadChannels(); }, [loadChannels]);

  useEffect(() => {
    if (channelsLoading || !channels.some((channel) => channel.configured) || draft || campaign || requestInFlight.current) return;
    let active = true;
    requestInFlight.current = true;
    setDraftLoading(true);
    setError("");
    createSocialDraft(productId).then((result) => {
      if (!active) return;
      setDraft({ campaignId: result.campaignId, productName: result.productName, imageUrl: result.imageUrl });
      setPosts(result.posts);
    }).catch((reason: any) => {
      if (active) setError(reason?.message || "Could not prepare a post for this listing.");
    }).finally(() => {
      requestInFlight.current = false;
      setDraftLoading(false);
    });
    return () => { active = false; };
  }, [campaign, channels, channelsLoading, draft, attempt, productId]);

  useEffect(() => {
    if (!campaign || !["queued", "publishing", "processing"].includes(campaign.status)) return;
    const timer = setInterval(() => fetchSocialCampaign(campaign.id).then(setCampaign).catch(() => {}), 4000);
    return () => clearInterval(timer);
  }, [campaign?.id, campaign?.status]);

  const togglePlatform = (platform: SocialPlatform) => {
    setError("");
    setSelected((current) => current.includes(platform)
      ? current.filter((item) => item !== platform)
      : [...current, platform]);
  };

  const submit = async () => {
    if (!draft) return;
    const invalid = selected.find((platform) => {
      const channel = channels.find((item) => item.platform === platform);
      const text = posts[platform]?.trim() ?? "";
      return !channel || !text || [...text].length > channel.captionLimit;
    });
    if (invalid) { setError("Add a caption within the channel limit before posting."); return; }
    setBusy(true);
    setError("");
    try {
      await publishSocialDraft({ campaignId: draft.campaignId, platforms: selected, posts });
      setCampaign(await fetchSocialCampaign(draft.campaignId));
    } catch (reason: any) {
      setError(reason?.message || "Could not start posting. Your draft is saved.");
    } finally { setBusy(false); }
  };

  const confirm = () => Alert.alert("Post to Agrivive pages?", "This listing will be shared on the official pages you selected.", [
    { text: "Review again", style: "cancel" }, { text: "Post", onPress: () => void submit() },
  ]);

  const retry = async () => {
    if (!campaign) return;
    setBusy(true);
    setError("");
    try {
      await retrySocialDraft(campaign.id);
      setCampaign(await fetchSocialCampaign(campaign.id));
    } catch (reason: any) { setError(reason?.message || "Could not retry the failed channels."); }
    finally { setBusy(false); }
  };

  if (channelsLoading || draftLoading) return <SafeAreaView style={styles.center}>
    <ActivityIndicator color={colors.primary} />
    <Text style={styles.muted}>{channelsLoading ? "Loading Agrivive pages…" : "Preparing your post…"}</Text>
  </SafeAreaView>;

  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Boost Visibility</Text>
    <Text style={styles.muted}>Review the listing and caption before it is shared.</Text>
    {error && !draft && channels.length ? <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>Your post is not ready yet</Text>
      <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
      <ButtonComponent title="Try again" variant="secondary" onPress={() => setAttempt((value) => value + 1)} style={styles.action} />
    </View> : null}
    {error && !channels.length ? <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>Agrivive pages could not be loaded</Text>
      <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
      <ButtonComponent title="Try again" variant="secondary" onPress={() => void loadChannels()} style={styles.action} />
    </View> : null}
    {!error && channels.length > 0 && !channels.some((channel) => channel.configured) ? <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>Posting is not available yet</Text>
      <Text style={styles.muted}>Agrivive’s official pages are being set up. Please try again later.</Text>
      <ButtonComponent title="Check again" variant="secondary" onPress={() => void loadChannels()} style={styles.action} />
      <ButtonComponent title="Back to listing" variant="ghost" onPress={() => router.back()} style={styles.action} />
    </View> : null}
    {draft && !campaign ? <SocialCampaignReview productName={draft.productName} imageUrl={draft.imageUrl}
      channels={channels} selectedPlatforms={selected} onTogglePlatform={togglePlatform} posts={posts}
      onChangePost={(platform, text) => setPosts((current) => ({ ...current, [platform]: text }))}
      busy={busy} error={error} onPublish={confirm} /> : null}
    {campaign ? <View style={styles.result}>
      <Text style={styles.resultTitle}>Publishing status: {statusLabel(campaign.status)}</Text>
      {campaign.lastError ? <Text style={styles.error}>{campaign.lastError}</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {campaign.results.map((post) => <View key={post.platform} style={styles.postResult}>
        <Text style={styles.muted}>{platformLabel(post.platform)} · {statusLabel(post.status)}{post.lastError ? ` — ${post.lastError}` : ""}</Text>
        {post.postUrl ? <Pressable onPress={() => void Linking.openURL(post.postUrl!)} accessibilityRole="link" style={styles.openLink}><Text style={styles.link}>View post</Text></Pressable> : null}
      </View>)}
      {campaign.results.some((post) => post.status === "failed") ? <ButtonComponent title="Retry failed channels" onPress={() => void retry()} disabled={busy} style={styles.action} /> : null}
    </View> : null}
  </ScrollView></SafeAreaView>;
}

function platformLabel(platform: string) {
  return ({ facebook: "Facebook", instagram: "Instagram", x: "X", tiktok: "TikTok" } as Record<string, string>)[platform] || platform;
}

function statusLabel(status: string) {
  return ({ queued: "Waiting", publishing: "Posting", processing: "Posting", published: "Posted", partial: "Some channels need attention", failed: "Could not post" } as Record<string, string>)[status] || status;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  title: { fontFamily: fonts.heading.bold, fontSize: 26, color: colors.text },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: spacing.xs },
  error: { color: colors.error, fontFamily: fonts.body.medium, marginTop: spacing.md },
  emptyCard: { marginTop: spacing.base, padding: spacing.base, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text }, action: { marginTop: spacing.md },
  result: { marginTop: spacing.base, padding: spacing.base, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  resultTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  postResult: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.sm },
  openLink: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  link: { color: colors.primary, fontFamily: fonts.body.semiBold, fontSize: 13 },
});
