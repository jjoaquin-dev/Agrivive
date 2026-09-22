import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../src/context/AuthContext";
import { uploadSellerAvatar } from "../../../src/api/seller";
import { colors, fonts, spacing, touchTargets } from "../../../src/theme";
import { CardComponent } from "../../../src/components/CardComponent";
import { BadgeComponent } from "../../../src/components/BadgeComponent";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import {
  MapPickerComponent,
  DAVAO_CITY_COORDINATES,
} from "../../../src/components/MapPickerComponent";
import {
  Store,
  Phone,
  MapPin,
  ShieldCheck,
  Shield,
  Info,
  Pencil,
  LogOut,
  Mail,
  Camera,
} from "lucide-react-native";

export default function ProfileOverviewScreen() {
  const router = useRouter();
  const { session, setup, refreshSetup, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    refreshSetup();
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
        console.error("Failed to upload avatar", err);
        Alert.alert(
          "Upload Failed",
          err?.message ||
            "Failed to upload photo. Please verify AWS S3 credentials in backend/.env.",
        );
      } finally {
        setUploadingAvatar(false);
      }
    },
    [refreshSetup],
  );

  const handlePickAvatar = useCallback(() => {
    Alert.alert("Profile Photo", "Update your seller profile picture", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Take Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission Required",
              "Camera permission is required to take a photo.",
            );
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            await performAvatarUpload(result.assets[0].uri);
          }
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission Required",
              "Photo library permission is required to select an image.",
            );
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            await performAvatarUpload(result.assets[0].uri);
          }
        },
      },
    ]);
  }, [performAvatarUpload]);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your Agrivive seller account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  }, [signOut, router]);

  const profile = setup?.profile;

  // Memoize coordinates to prevent Leaflet WebView from re-rendering unnecessarily
  const coordinates = useMemo(
    () => ({
      latitude: profile?.latitude ?? DAVAO_CITY_COORDINATES.latitude,
      longitude: profile?.longitude ?? DAVAO_CITY_COORDINATES.longitude,
    }),
    [profile?.latitude, profile?.longitude],
  );

  const avatarUrl = setup?.account?.image || session?.user?.image;
  const sellerInitial = setup?.account?.name
    ? setup.account.name[0].toUpperCase()
    : session?.user?.name
    ? session.user.name[0].toUpperCase()
    : "S";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* 1. Merchant Identity Header Card */}
      <CardComponent style={styles.headerCard}>
        <View style={styles.avatarRow}>
          <Pressable
            onPress={handlePickAvatar}
            disabled={uploadingAvatar}
            accessibilityRole="button"
            accessibilityLabel="Change profile picture"
            style={styles.avatarWrapper}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{sellerInitial}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Camera size={13} color={colors.white} />
              )}
            </View>
          </Pressable>

          <View style={styles.headerInfo}>
            <Text style={styles.personName}>
              {setup?.account?.name || session?.user?.name || "Seller"}
            </Text>
            {profile?.shopName ? (
              <View style={styles.shopSubTitleRow}>
                <Store size={14} color={colors.primary} style={styles.inlineIcon} />
                <Text style={styles.shopSubTitle}>{profile.shopName}</Text>
              </View>
            ) : null}
            <Text style={styles.personEmail}>
              {setup?.account?.email || session?.user?.email}
            </Text>
          </View>
        </View>

        {/* Server-Derived Verified Account Badge */}
        <View style={styles.badgeSection}>
          {setup?.badge ? (
            <BadgeComponent
              label={setup.badge.label}
              explanation={setup.badge.explanation}
              variant="verified"
            />
          ) : setup?.emailVerified ? (
            <BadgeComponent
              label="Email Verified"
              explanation="Complete stall profile to earn Verified account badge."
              variant="warning"
            />
          ) : (
            <BadgeComponent
              label="Unverified"
              explanation="Verify your email to list and sell surplus produce."
              variant="error"
            />
          )}
        </View>

        <View style={styles.headerDivider} />

        <ButtonComponent
          title="Edit Profile & Stall Details"
          icon={<Pencil size={15} color={colors.primary} />}
          variant="secondary"
          onPress={() => router.push("/(app)/profile/edit")}
          style={styles.quickEditBtn}
          textStyle={styles.quickEditBtnText}
        />
      </CardComponent>

      {/* 2. Market Stall Details */}
      <Text style={styles.sectionHeading}>Market Stall Details</Text>
      <CardComponent style={styles.card}>
        <View style={styles.detailItem}>
          <View style={styles.iconCircle}>
            <Store size={16} color={colors.primary} />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>Shop or Stall Name</Text>
            <Text style={styles.itemValue}>{profile?.shopName || "Not configured"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <View style={styles.iconCircle}>
            <Phone size={16} color={colors.primary} />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>Contact Phone</Text>
            <Text style={styles.itemValue}>{profile?.phoneNumber || "Not configured"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <View style={styles.iconCircle}>
            <MapPin size={16} color={colors.primary} />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>Stall Address & Landmarks</Text>
            <Text style={styles.itemValue}>{profile?.detailAddress || "Not configured"}</Text>
          </View>
        </View>
      </CardComponent>

      {/* 3. Pickup Location Preview */}
      <Text style={styles.sectionHeading}>Pickup Location Map</Text>
      <CardComponent style={styles.mapCard}>
        <Text style={styles.mapHint}>
          Buyers use this confirmed OpenStreetMap pin for navigation during surplus pickup:
        </Text>
        <MapPickerComponent
          initialCoordinates={coordinates}
          height={160}
          readOnly
        />
      </CardComponent>

      {/* 4. Account & Security */}
      <Text style={styles.sectionHeading}>Account & Security</Text>
      <CardComponent style={styles.card}>
        <View style={styles.securityHeader}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={18} color={colors.primary} />
          </View>
          <View style={styles.securityTextGroup}>
            <View style={styles.securityTitleRow}>
              <Text style={styles.securityTitle}>Two-Factor Authentication (2FA)</Text>
              <BadgeComponent
                label={setup?.twoFactorEnabled ? "Active" : "Optional"}
                variant={setup?.twoFactorEnabled ? "success" : "neutral"}
              />
            </View>
            <Text style={styles.securityDesc}>
              {setup?.twoFactorEnabled
                ? "TOTP authenticator app challenge enforced at sign in."
                : "Add an extra layer of security using Google Authenticator."}
            </Text>
          </View>
        </View>

        <ButtonComponent
          title={setup?.twoFactorEnabled ? "Manage 2FA Settings" : "Enable Authenticator (2FA)"}
          icon={<Shield size={15} color={colors.primary} />}
          variant="secondary"
          onPress={() => router.push("/(app)/profile/security")}
          style={styles.securityButton}
        />
      </CardComponent>

      {/* 5. Davao Pilot Support (conforming to DESIGN.md Section 7) */}
      <Text style={styles.sectionHeading}>Support & Pilot Info</Text>
      <CardComponent style={styles.card}>
        <View style={styles.supportRow}>
          <View style={styles.iconCircle}>
            <Info size={18} color={colors.primary} />
          </View>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Davao Agricultural Surplus Marketplace</Text>
            <Text style={styles.supportText}>
              Connecting Bankerohan, Agdao, Toril, and local public markets with surplus buyers.
            </Text>
            <View style={styles.supportContactRow}>
              <Mail size={13} color={colors.primary} style={styles.inlineIcon} />
              <Text style={styles.supportContact}>Helpdesk: support@agrivive.com</Text>
            </View>
          </View>
        </View>
      </CardComponent>

      {/* 6. Footer Actions */}
      <View style={styles.actionButtons}>
        <ButtonComponent
          title="Sign Out"
          icon={<LogOut size={16} color={colors.error} />}
          variant="ghost"
          onPress={handleSignOut}
          style={styles.signOutButton}
          textStyle={styles.signOutButtonText}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  headerCard: {
    marginBottom: spacing.lg,
    padding: spacing.base,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: spacing.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: colors.sage,
    backgroundColor: colors.surface,
  },
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  avatarText: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  personName: {
    fontFamily: fonts.heading.bold,
    fontSize: 19,
    color: colors.text,
    marginBottom: 2,
  },
  shopSubTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  inlineIcon: {
    marginRight: 4,
  },
  shopSubTitle: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.primary,
  },
  personEmail: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  badgeSection: {
    marginBottom: spacing.xs,
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  quickEditBtn: {
    minHeight: 44,
  },
  quickEditBtnText: {
    fontSize: 14,
  },
  sectionHeading: {
    fontFamily: fonts.heading.semiBold,
    fontSize: 15,
    color: colors.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
    marginLeft: 2,
  },
  card: {
    marginBottom: spacing.base,
    padding: spacing.base,
  },
  mapCard: {
    marginBottom: spacing.base,
    padding: spacing.base,
  },
  mapHint: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.base,
  },
  securityTextGroup: {
    flex: 1,
  },
  securityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  securityDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  securityButton: {
    minHeight: 44,
  },
  supportRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  supportText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: spacing.xs,
  },
  supportContactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  supportContact: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  actionButtons: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  signOutButton: {
    minHeight: touchTargets.min,
    width: "100%",
  },
  signOutButtonText: {
    color: colors.error,
    fontWeight: "600",
  },
});
