import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { createSellerProfile, updateSellerPersonalName } from "../../../src/api/seller";
import { colors, fonts, spacing } from "../../../src/theme";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { SetupProgress } from "../../../src/features/profile/components/SetupProgress";
import { profileColors } from "../../../src/features/profile/profileTokens";
import { InputComponent } from "../../../src/components/InputComponent";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { MapPickerComponent, Coordinates, DAVAO_CITY_COORDINATES } from "../../../src/components/MapPickerComponent";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, refreshSetup } = useAuth();
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const [personName, setPersonName] = useState(
    session?.user?.name && session.user.name !== "Seller"
      ? session.user.name
      : "",
  );
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates>(
    DAVAO_CITY_COORDINATES,
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    personName?: string;
    shopName?: string;
    phoneNumber?: string;
    detailAddress?: string;
    coordinates?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!personName.trim()) {
      newErrors.personName = "Please enter your full personal name.";
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your contact phone number.";
    } else if (phoneNumber.trim().length < 7) {
      newErrors.phoneNumber = "Please enter a valid phone number (at least 7 digits).";
    }
    if (!shopName.trim()) {
      newErrors.shopName = "Please enter your stall or shop name.";
    }
    if (!detailAddress.trim()) {
      newErrors.detailAddress = "Please enter your stall address or market section.";
    }
    if (
      !coordinates ||
      typeof coordinates.latitude !== "number" ||
      typeof coordinates.longitude !== "number"
    ) {
      newErrors.coordinates = "Please set your stall location on the map.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await updateSellerPersonalName(personName.trim());
      await createSellerProfile({
        shopName: shopName.trim(),
        detailAddress: detailAddress.trim(),
        phoneNumber: phoneNumber.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      const setup = await refreshSetup();

      if (setup && !setup.emailVerified) {
        router.replace({
          pathname: "/(auth)/verify-email",
          params: {
            email: session?.user?.email ?? "",
            sent: "true",
          },
        });
        return;
      }

      if (setup?.passwordSetupRequired || setup?.nextStep === "password-setup") {
        router.replace("/(auth)/password-setup");
        return;
      }

      router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      console.error("Seller profile setup failed", err);
      setErrors({
        general:
          err?.message || "Failed to save profile. Please check all fields and try again.",
      });
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } finally {
      setLoading(false);
    }
  };

  const clear = (key: keyof typeof errors) => setErrors((prev) => ({ ...prev, [key]: undefined }));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.topRow}>
          {router.canGoBack() ? (
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}>
              <ChevronLeft size={22} color={colors.text} />
            </Pressable>
          ) : <View style={styles.back} />}
          <Text style={styles.topTitle}>Agrivive Seller Setup</Text>
          <View style={styles.back} />
        </View>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <View style={styles.header}>
            <Text style={styles.title}>Set Up Your Stall</Text>
            <Text style={styles.subtitle}>Step 2 of 3 · Your Stall</Text>
            <SetupProgress current={2} />
          </View>

          {errors.general ? <View style={styles.errorBox}><Text style={styles.errorBoxText}>{errors.general}</Text></View> : null}

          <InputComponent label="Your Full Name" placeholder="e.g. Juan dela Cruz" value={personName} error={errors.personName} hint="Used for seller identity verification"
            onChangeText={(text) => { setPersonName(text); clear("personName"); }} />
          <InputComponent label="Stall Name" placeholder="e.g. Dela Cruz Fresh Veggies" value={shopName} error={errors.shopName}
            onChangeText={(text) => { setShopName(text); clear("shopName"); }} />

          <Text style={styles.fieldLabel}>Stall Location</Text>
          <Text style={styles.fieldHint}>Pick your public market below, or tap the map to place your pin.</Text>
          <MapPickerComponent initialCoordinates={coordinates} error={errors.coordinates}
            onCoordinatesChange={(newCoords, suggestedAddress) => {
              setCoordinates(newCoords);
              if (suggestedAddress && !detailAddress.trim()) setDetailAddress(suggestedAddress);
              clear("coordinates");
            }} />
          <View style={styles.afterMap}>
            <InputComponent label="Address" placeholder="e.g. Stall #14, Vegetable Section, Bankerohan" multiline numberOfLines={2} value={detailAddress} error={errors.detailAddress}
              hint="Shown on buyer reservations and pickup directions." onChangeText={(text) => { setDetailAddress(text); clear("detailAddress"); }} />
          </View>
          <InputComponent label="Phone Number" placeholder="09123456789" keyboardType="phone-pad" value={phoneNumber} error={errors.phoneNumber}
            hint="Buyers contact you about reservations" onChangeText={(text) => { setPhoneNumber(text); clear("phoneNumber"); }} />
        </ScrollView>
        <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <ButtonComponent title="Save and Continue" icon={<ArrowRight size={18} color={colors.white} />} onPress={handleSaveProfile} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: profileColors.cream },
  keyboardContainer: { flex: 1 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.sm, minHeight: 48 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  topTitle: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.textMuted },
  scrollContent: { paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.xl },
  header: { marginBottom: spacing.lg },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 15, color: colors.textMuted, marginTop: 2 },
  fieldLabel: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text, marginBottom: 2 },
  fieldHint: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  afterMap: { marginTop: spacing.base },
  errorBox: { backgroundColor: profileColors.redSoft, borderWidth: 1, borderColor: colors.error, borderRadius: 10, padding: spacing.md, marginBottom: spacing.base },
  errorBoxText: { color: colors.error, fontSize: 13, fontFamily: fonts.body.medium },
  bar: { paddingHorizontal: spacing.base, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: profileColors.border },
});
