import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../src/context/AuthContext";
import { useSellerTrust } from "../../../src/features/trust/hooks/useSellerTrust";
import { uploadSellerAvatar } from "../../../src/api/seller";
import { DAVAO_CITY_COORDINATES } from "../../../src/components/MapPickerComponent";
import { ProfileHeaderBar } from "../../../src/features/profile/components/ProfileHeaderBar";
import { ProfileHeroCard } from "../../../src/features/profile/components/ProfileHeroCard";
import { ProfileVerificationCard } from "../../../src/features/profile/components/ProfileVerificationCard";
import { ProfileBusinessInfoCard } from "../../../src/features/profile/components/ProfileBusinessInfoCard";
import { ProfileLocationCard } from "../../../src/features/profile/components/ProfileLocationCard";
import { ProfileContactCard } from "../../../src/features/profile/components/ProfileContactCard";
import { ProfileSettingsList } from "../../../src/features/profile/components/ProfileSettingsList";
import { colors, spacing } from "../../../src/theme";

export default function ProfileOverviewScreen() {
  const router = useRouter();
  const { session, setup, refreshSetup, signOut } = useAuth();
  const { trust } = useSellerTrust();
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    void refreshSetup();
  }, [refreshSetup]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshSetup();
    setRefreshing(false);
  }, [refreshSetup]);

  const performAvatarUpload = useCallback(
    async (uri: string) => {
      setUploadingAvatar(true);
      try {
        await uploadSellerAvatar(uri);
        await refreshSetup();
        Alert.alert("Success", "Profile picture updated successfully!");
      } catch (err: any) {
        Alert.alert("Upload Failed", err?.message || "Failed to upload photo.");
      } finally {
        setUploadingAvatar(false);
      }
    },
    [refreshSetup]
  );

  const handlePickAvatar = useCallback(() => {
    Alert.alert("Profile Photo", "Update your seller profile picture", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Take Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") return Alert.alert("Permission Required", "Camera permission is required.");
          const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!res.canceled && res.assets?.[0]?.uri) await performAvatarUpload(res.assets[0].uri);
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") return Alert.alert("Permission Required", "Photo library permission is required.");
          const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!res.canceled && res.assets?.[0]?.uri) await performAvatarUpload(res.assets[0].uri);
        },
      },
    ]);
  }, [performAvatarUpload]);

  const handleSignOut = useCallback(() => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }, [signOut, router]);

  const profile = setup?.profile;
  const coordinates = useMemo(
    () => ({
      latitude: profile?.latitude ?? DAVAO_CITY_COORDINATES.latitude,
      longitude: profile?.longitude ?? DAVAO_CITY_COORDINATES.longitude,
    }),
    [profile?.latitude, profile?.longitude]
  );

  const avatarUrl = setup?.account?.image || session?.user?.image;
  const sellerName = setup?.account?.name || session?.user?.name || "Seller";
  const shopName = profile?.shopName || "Bankerohan Public Market";
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString([], { month: "short", year: "numeric" })
    : "Jul 2026";
  const verifiedSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })
    : "July 23, 2026";
  const sellerId = setup?.account?.id ? `AGV-${setup.account.id.slice(0, 8).toUpperCase()}` : "AGV-SELLER";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeaderBar
        onEdit={() => router.push("/(app)/profile/edit")}
        onSecurity={() => router.push("/(app)/profile/security")}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16A34A"]}
            tintColor="#16A34A"
          />
        }
      >
        <ProfileHeroCard
          shopName={shopName}
          sellerName={sellerName}
          sellerType={(profile as any)?.sellerType || "supplier"}
          avatarUrl={avatarUrl}
          isVerified={Boolean(setup?.sellerVerified || setup?.badge)}
          memberSince={memberSince}
          profileComplete={Boolean(setup?.profileComplete)}
          trustPoints={trust?.monitoring?.weightedPoints ?? 100}
          uploadingAvatar={uploadingAvatar}
          onPickAvatar={handlePickAvatar}
          onEditProfile={() => router.push("/(app)/profile/edit")}
          onSecurity={() => router.push("/(app)/profile/security")}
        />

        <ProfileVerificationCard
          isVerified={Boolean(setup?.sellerVerified || setup?.badge)}
          sellerType={(profile as any)?.sellerType || "supplier"}
          verifiedSince={verifiedSince}
          isActive={(session?.user as any)?.isActive !== false}
          onRequestReview={() => router.push("/(app)/trust")}
        />

        <ProfileBusinessInfoCard
          businessName={shopName}
          ownerName={sellerName}
          marketName={shopName}
          email={setup?.account?.email || session?.user?.email || "seller@agrivive.com"}
          sellerId={sellerId}
          onEdit={() => router.push("/(app)/profile/edit")}
        />

        <ProfileLocationCard
          coordinates={coordinates}
          marketName={shopName}
          detailAddress={profile?.detailAddress || "Stall 42, Vegetable Section, Bankerohan Market"}
          pickupInstructions={(profile as any)?.pickupInstructions}
          onEdit={() => router.push("/(app)/profile/edit")}
        />

        <ProfileContactCard
          phoneNumber={profile?.phoneNumber || "Not configured"}
          email={setup?.account?.email || session?.user?.email || "seller@agrivive.com"}
          onEdit={() => router.push("/(app)/profile/edit")}
        />

        <ProfileSettingsList
          onNotifications={() => router.push("/(app)/notifications")}
          onTrust={() => router.push("/(app)/trust")}
          onSecurity={() => router.push("/(app)/profile/security")}
          onActivity={() => router.push("/(app)/activity")}
          onSignOut={handleSignOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.xxl },
});
