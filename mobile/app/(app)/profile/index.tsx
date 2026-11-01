import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { useSellerTrust } from "../../../src/features/trust/hooks/useSellerTrust";
import { DAVAO_CITY_COORDINATES } from "../../../src/components/MapPickerComponent";
import { ConfirmDialogComponent } from "../../../src/components/ConfirmDialogComponent";
import { useProfileAvatar } from "../../../src/features/profile/hooks/useProfileAvatar";
import { ProfileScreenHeader } from "../../../src/features/profile/components/ProfileScreenHeader";
import { ProfileHeroCard } from "../../../src/features/profile/components/ProfileHeroCard";
import { ProfileStandingCard } from "../../../src/features/profile/components/ProfileStandingCard";
import { ProfileSetupChecklist } from "../../../src/features/profile/components/ProfileSetupChecklist";
import { ProfileStallCard } from "../../../src/features/profile/components/ProfileStallCard";
import { ProfileSettingsList } from "../../../src/features/profile/components/ProfileSettingsList";
import { ProfilePhotoSheet } from "../../../src/features/profile/components/ProfilePhotoSheet";
import { profileColors } from "../../../src/features/profile/profileTokens";
import { colors, fonts, spacing } from "../../../src/theme";

export default function ProfileOverviewScreen() {
  const router = useRouter();
  const { session, setup, refreshSetup, signOut } = useAuth();
  const { trust, loading: trustLoading, error: trustError } = useSellerTrust();
  const avatar = useProfileAvatar();
  const [refreshing, setRefreshing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => { void refreshSetup(); }, [refreshSetup]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshSetup();
    setRefreshing(false);
  }, [refreshSetup]);

  const logOut = useCallback(async () => {
    setConfirmLogout(false);
    await signOut();
    router.replace("/(auth)/login");
  }, [signOut, router]);

  const profile = setup?.profile;
  const coordinates = useMemo(() => ({
    latitude: profile?.latitude ?? DAVAO_CITY_COORDINATES.latitude,
    longitude: profile?.longitude ?? DAVAO_CITY_COORDINATES.longitude,
  }), [profile?.latitude, profile?.longitude]);

  const email = setup?.account?.email || session?.user?.email || "Not set";
  const sellerName = setup?.account?.name || session?.user?.name || "Seller";
  const shopName = profile?.shopName || "Your stall";
  const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString([], { month: "short", year: "numeric" }) : "today";
  const sellerId = setup?.account?.id ? `AGV-${setup.account.id.slice(0, 8).toUpperCase()}` : null;
  const isVerified = Boolean(setup?.sellerVerified || setup?.badge);
  const goEdit = () => router.push("/(app)/profile/edit");

  const steps = [
    { title: "Verify your email", hint: "Confirm your email address", done: Boolean(setup?.emailVerified) },
    { title: "Add your stall", hint: "Pinned stall & pickup info", done: Boolean(setup?.profileComplete) },
    { title: "Make a password", hint: "Sign in with your email", done: Boolean(setup) && !setup?.passwordSetupRequired },
  ];
  const continueSetup = () => {
    if (!setup?.emailVerified) router.push({ pathname: "/(auth)/verify-email", params: { email, sent: "false" } });
    else if (!setup?.profileComplete) router.push("/(app)/profile/setup");
    else router.push("/(auth)/password-setup");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreenHeader title="Profile" large />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <ProfileHeroCard shopName={shopName} sellerName={sellerName} avatarUrl={setup?.account?.image || session?.user?.image}
          isVerified={isVerified} memberSince={memberSince} uploadingAvatar={avatar.uploading} onPickAvatar={avatar.openSheet} onEditProfile={goEdit} />
        {setup && setup.nextStep !== "ready" ? <ProfileSetupChecklist steps={steps} onContinue={continueSetup} /> : null}
        <ProfileStandingCard trust={trust} loading={trustLoading} failed={Boolean(trustError)} isActive={(session?.user as any)?.isActive !== false} onPress={() => router.push("/(app)/trust")} />
        <ProfileStallCard coordinates={coordinates} detailAddress={profile?.detailAddress || "No stall address yet"} pickupInstructions={(profile as any)?.pickupInstructions}
          phoneNumber={profile?.phoneNumber || "Not set"} email={email} onEdit={goEdit} />
        <ProfileSettingsList twoFactorEnabled={Boolean(setup?.twoFactorEnabled)} onNotifications={() => router.push("/(app)/notifications")} onReviews={() => router.push("/(app)/reviews")}
          onTrust={() => router.push("/(app)/trust")} onSecurity={() => router.push("/(app)/profile/security")} onActivity={() => router.push("/(app)/activity")} onSignOut={() => setConfirmLogout(true)} />
        {sellerId ? <Text style={styles.footer}>Seller ID {sellerId}</Text> : null}
      </ScrollView>
      <ProfilePhotoSheet visible={avatar.sheetOpen} onTake={avatar.takePhoto} onChoose={avatar.choosePhoto} onClose={avatar.closeSheet} />
      <ConfirmDialogComponent visible={confirmLogout} icon={<LogOut size={22} color={profileColors.red} />} title="Log out of Agrivive?"
        message="You will need to sign in again to manage your stall and produce." cancelLabel="Cancel" confirmLabel="Log Out" onCancel={() => setConfirmLogout(false)} onConfirm={() => void logOut()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: profileColors.cream },
  content: { paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  footer: { textAlign: "center", fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
});
