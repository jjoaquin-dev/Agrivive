import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { RotateCcw, Sparkles } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { acceptSellerBoostPrompt, fetchSellerProductBoost, markSellerBoostPromptRead, requestSellerVisibilityBoost } from "../../../src/features/boost/api/visibility-boosts";
import { SocialCampaignReview } from "../../../src/features/boost/components/SocialCampaignReview";
import { BoostStatusCard } from "../../../src/features/boost/components/BoostStatusCard";
import { BoostCycleIndicator } from "../../../src/features/boost/components/BoostCycleIndicator";
import {
  createSocialDraft, fetchSocialCampaign, fetchSocialChannels, publishSocialDraft, retrySocialDraft,
  type CampaignStatus, type SocialChannel, type SocialDraft, type SocialPlatform,
} from "../../../src/features/boost/api/social-campaigns";
import type { SellerProductBoostResponse } from "../../../src/features/boost/types";
import { colors, fonts, radii, spacing } from "../../../src/theme";

export default function BoostVisibilityScreen() {
  const router = useRouter();
  const { productId, entry, promptId } = useLocalSearchParams<{ productId: string; entry?: string; promptId?: string }>();
  const openedFromProductCreate = entry === "new-product";
  const [boostData, setBoostData] = useState<SellerProductBoostResponse | null>(null);
  const [boostLoading, setBoostLoading] = useState(true), [boostError, setBoostError] = useState("");
  const [channels, setChannels] = useState<SocialChannel[]>([]), [selected, setSelected] = useState<SocialPlatform[]>([]);
  const [draft, setDraft] = useState<SocialDraft | null>(null), [campaign, setCampaign] = useState<CampaignStatus | null>(null);
  const [posts, setPosts] = useState<Partial<Record<SocialPlatform, string>>>({});
  const [channelsLoading, setChannelsLoading] = useState(true), [draftLoading, setDraftLoading] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [attempt, setAttempt] = useState(0);
  const requestInFlight = useRef(false), initializedSelection = useRef(false);

  const loadBoostStatus = useCallback(async () => {
    if (!productId) return;
    setBoostLoading(true);
    setBoostError("");
    try { setBoostData(await fetchSellerProductBoost(productId)); }
    catch (reason: any) { setBoostError(reason?.message || "Could not load the boost status."); }
    finally { setBoostLoading(false); }
  }, [productId]);

  useFocusEffect(useCallback(() => { void loadBoostStatus(); }, [loadBoostStatus]));

  useEffect(() => {
    if (promptId) void markSellerBoostPromptRead(promptId);
  }, [promptId]);

  const loadChannels = useCallback(async () => {
    setChannelsLoading(true);
    setError("");
    try {
      const result = await fetchSocialChannels();
      setChannels(result.channels);
      if (!initializedSelection.current) {
        setSelected(result.channels.filter((c) => c.configured).map((c) => c.platform));
        initializedSelection.current = true;
      } else {
        setSelected((cur) => cur.filter((p) => result.channels.some((c) => c.platform === p && c.configured)));
      }
    } catch (reason: any) { setError(reason?.message || "Could not load Agrivive channels."); }
    finally { setChannelsLoading(false); }
  }, []);

  useEffect(() => { void loadChannels(); }, [loadChannels]);

  useEffect(() => {
    if (!productId || channelsLoading || !channels.some((c) => c.configured) || draft || campaign || requestInFlight.current) return;
    let active = true;
    requestInFlight.current = true;
    setDraftLoading(true);
    setError("");
    createSocialDraft(productId).then(async (result: any) => {
      if (!active) return;
      if (result.alreadyPublished && result.campaignId) {
        try {
          const existing = await fetchSocialCampaign(result.campaignId);
          if (active) setCampaign(existing);
        } catch {}
        return;
      }
      setDraft(result);
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
    let active = true;
    const refresh = async () => {
      try {
        const next = await fetchSocialCampaign(campaign.id);
        if (active) setCampaign(next);
      } catch (reason: any) {
        if (active) setError(reason?.message || "Could not refresh publishing status.");
      }
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 4000);
    return () => { active = false; clearInterval(timer); };
  }, [campaign?.id, campaign?.status]);

  const queueBoost = async () => {
    if (!productId) return;
    setBusy(true);
    setBoostError("");
    try {
      await requestSellerVisibilityBoost(productId);
      await loadBoostStatus();
    } catch (reason: any) { setBoostError(reason?.message || "Could not queue the visibility boost."); }
    finally { setBusy(false); }
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setError("");
    setSelected((cur) => cur.includes(platform) ? cur.filter((i) => i !== platform) : [...cur, platform]);
  };

  const submit = async () => {
    if (!draft) return;
    const invalid = selected.find((platform) => {
      const channel = channels.find((item) => item.platform === platform);
      const text = posts[platform]?.trim() ?? "";
      return !channel || !text || [...text].length > channel.captionLimit;
    });
    if (invalid) { setError("Add a description within the channel limit before posting."); return; }
    setBusy(true);
    setError("");
    try {
      await publishSocialDraft({ campaignId: draft.campaignId, platforms: selected, posts });
      const activePromptId = promptId || (boostData?.boost?.status === "prompt" ? boostData.boost.id : null);
      if (activePromptId) {
        try { await acceptSellerBoostPrompt(activePromptId); } catch {}
      }
      setCampaign(await fetchSocialCampaign(draft.campaignId));
      await loadBoostStatus();
    } catch (reason: any) { setError(reason?.message || "Could not start posting. Your draft is saved."); }
    finally { setBusy(false); }
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
    } catch (reason: any) { setError(reason?.message || "Could not retry failed channels."); }
    finally { setBusy(false); }
  };

  const canBoost = boostData?.eligibility?.canBoost ?? true;
  const status = boostData?.boost?.status;
  const statusWaiting = status === "queued" || status === "sent";

  if (channelsLoading || draftLoading) return <SafeAreaView style={styles.center}>
    <ActivityIndicator color={colors.primary} />
    <Text style={styles.muted}>{channelsLoading ? "Loading Agrivive pages…" : "Preparing your post…"}</Text>
  </SafeAreaView>;

  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.headingRow}><View style={styles.icon}><Sparkles size={22} color={colors.primary} /></View><View style={styles.headingCopy}><Text style={styles.title}>Boost Visibility</Text><Text style={styles.subtitle}>{draft?.productName || boostData?.product.productName || "Your listing"}</Text></View></View>
    <Text style={styles.muted}>Review the listing, choose Agrivive pages, and edit the description before it is shared.</Text>
    {boostLoading ? <ActivityIndicator color={colors.primary} style={styles.statusLoader} /> : null}
    {boostData?.eligibility && boostData?.pricing ? <BoostCycleIndicator eligibility={boostData.eligibility} pricing={boostData.pricing} /> : null}
    {boostData?.boost ? <BoostStatusCard boost={boostData.boost} /> : null}
    {boostError ? <Text accessibilityRole="alert" style={styles.error}>{boostError}</Text> : null}
    {!openedFromProductCreate && !boostLoading && !statusWaiting && !campaign && canBoost ? <ButtonComponent title={status === "failed" ? "Try again" : "Boost this listing"} onPress={() => void queueBoost()} loading={busy && !draft} style={styles.statusAction} icon={status === "failed" ? <RotateCcw size={17} color={colors.white} /> : undefined} /> : null}
    {error && !draft && channels.length ? <View style={styles.emptyCard}><Text style={styles.emptyTitle}>Your post is not ready yet</Text><Text accessibilityRole="alert" style={styles.error}>{error}</Text><ButtonComponent title="Try again" variant="secondary" onPress={() => setAttempt((v) => v + 1)} style={styles.action} /></View> : null}
    {draft && !campaign && canBoost ? <SocialCampaignReview productName={draft.productName} productUrl={draft.productUrl} imageUrl={draft.imageUrl} channels={channels} selectedPlatforms={selected} onTogglePlatform={togglePlatform} posts={posts} onChangePost={(p, text) => setPosts((cur) => ({ ...cur, [p]: text }))} busy={busy} error={error} onPublish={confirm} /> : null}
    {campaign ? <View style={styles.result}><Text style={styles.resultTitle}>Publishing status: {statusLabel(campaign.status)}</Text><Pressable onPress={() => void Linking.openURL(campaign.productUrl)} accessibilityRole="link" style={styles.openLink}><Text style={styles.link}>View product in marketplace</Text></Pressable>{campaign.lastError ? <Text style={styles.error}>{campaign.lastError}</Text> : null}{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}{campaign.results.map((post) => <View key={post.platform} style={styles.postResult}><Text style={styles.muted}>{platformLabel(post.platform)} · {statusLabel(post.status)}{post.lastError ? ` — ${post.lastError}` : ""}</Text>{post.postUrl ? <Pressable onPress={() => void Linking.openURL(post.postUrl!)} accessibilityRole="link" style={styles.openLink}><Text style={styles.link}>View post</Text></Pressable> : null}</View>)}{campaign.results.some((p) => p.status === "failed") ? <ButtonComponent title="Retry failed channels" onPress={() => void retry()} disabled={busy} style={styles.action} /> : null}</View> : null}
    <Pressable onPress={() => router.push("/(app)/boosts")} accessibilityRole="button" style={styles.historyLink}><Text style={styles.historyLinkText}>View boost history</Text></Pressable>
    <ButtonComponent title="Back" variant="ghost" onPress={() => router.back()} style={styles.back} textStyle={styles.backText} />
  </ScrollView></SafeAreaView>;
}

const platformLabel = (p: string) => ({ facebook: "Facebook", instagram: "Instagram", x: "X", tiktok: "TikTok" } as Record<string, string>)[p] || p;
const statusLabel = (s: string) => ({ queued: "Waiting", publishing: "Posting", processing: "Posting", published: "Posted", partial: "Some channels need attention", failed: "Could not post" } as Record<string, string>)[s] || s;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.base, paddingBottom: spacing.xxxl }, center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }, headingRow: { flexDirection: "row", alignItems: "center" }, icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: spacing.md }, headingCopy: { flex: 1 }, title: { fontFamily: fonts.heading.bold, fontSize: 24, lineHeight: 32, color: colors.text }, subtitle: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.primary, marginTop: 2 }, muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: spacing.xs }, statusLoader: { marginTop: spacing.md }, statusAction: { marginTop: spacing.md, minHeight: 48 }, error: { color: colors.error, fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, marginTop: spacing.md }, emptyCard: { marginTop: spacing.base, padding: spacing.base, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border }, emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text }, action: { marginTop: spacing.md }, result: { marginTop: spacing.base, padding: spacing.base, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border }, resultTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text }, postResult: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.sm }, openLink: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" }, link: { color: colors.primary, fontFamily: fonts.body.semiBold, fontSize: 13 }, historyLink: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: spacing.md }, historyLinkText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary }, back: { marginTop: spacing.xs, minHeight: 44 }, backText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
});
