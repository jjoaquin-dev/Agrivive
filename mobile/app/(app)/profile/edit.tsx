import React, { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useNavigation, useRouter } from "expo-router";
import { AlertTriangle, Check } from "lucide-react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { updateSellerPersonalName, updateSellerProfile } from "../../../src/api/seller";
import { InputComponent } from "../../../src/components/InputComponent";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { ConfirmDialogComponent } from "../../../src/components/ConfirmDialogComponent";
import { Coordinates, DAVAO_CITY_COORDINATES, MapPickerComponent } from "../../../src/components/MapPickerComponent";
import { useProfileAvatar } from "../../../src/features/profile/hooks/useProfileAvatar";
import { ProfileScreenHeader } from "../../../src/features/profile/components/ProfileScreenHeader";
import { ProfileEditPhotoRow } from "../../../src/features/profile/components/ProfileEditPhotoRow";
import { ProfilePhotoSheet } from "../../../src/features/profile/components/ProfilePhotoSheet";
import { profileColors } from "../../../src/features/profile/profileTokens";
import { colors, fonts, spacing } from "../../../src/theme";

type Errors = { personName?: string; shopName?: string; phoneNumber?: string; detailAddress?: string; coordinates?: string; general?: string };

export default function ProfileEditScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { session, setup, refreshSetup } = useAuth();
  const avatar = useProfileAvatar();
  const profile = setup?.profile;
  const startName = setup?.account?.name || session?.user?.name || "";

  const [personName, setPersonName] = useState(startName);
  const [shopName, setShopName] = useState(profile?.shopName || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || "");
  const [detailAddress, setDetailAddress] = useState(profile?.detailAddress || "");
  const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: profile?.latitude ?? DAVAO_CITY_COORDINATES.latitude, longitude: profile?.longitude ?? DAVAO_CITY_COORDINATES.longitude });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [leaveAction, setLeaveAction] = useState<any>(null);

  const initial = useRef({ personName, shopName, phoneNumber, detailAddress, latitude: coordinates.latitude, longitude: coordinates.longitude });
  const dirty = personName !== initial.current.personName || shopName !== initial.current.shopName || phoneNumber !== initial.current.phoneNumber
    || detailAddress !== initial.current.detailAddress || coordinates.latitude !== initial.current.latitude || coordinates.longitude !== initial.current.longitude;
  const allowLeave = useRef(false);

  useEffect(() => (navigation as any).addListener("beforeRemove", (event: any) => {
    if (allowLeave.current || !dirty) return;
    event.preventDefault();
    setLeaveAction(event.data.action);
  }), [navigation, dirty]);

  const change = (setter: (value: string) => void, key: keyof Errors) => (text: string) => {
    setter(text);
    setErrors((prev) => ({ ...prev, [key]: undefined, general: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!personName.trim()) next.personName = "Please enter your full name.";
    if (!shopName.trim()) next.shopName = "Please enter your stall or shop name.";
    if (!phoneNumber.trim()) next.phoneNumber = "Please enter your contact phone number.";
    else if (phoneNumber.trim().length < 7) next.phoneNumber = "Please enter a valid phone number (at least 7 digits).";
    if (!detailAddress.trim()) next.detailAddress = "Please enter your stall address.";
    if (!coordinates || typeof coordinates.latitude !== "number") next.coordinates = "Please confirm your stall location on the map.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      if (personName.trim() !== (setup?.account?.name || session?.user?.name)) await updateSellerPersonalName(personName);
      await updateSellerProfile({ shopName: shopName.trim(), detailAddress: detailAddress.trim(), phoneNumber: phoneNumber.trim(), latitude: coordinates.latitude, longitude: coordinates.longitude });
      await refreshSetup();
      allowLeave.current = true;
      router.back();
    } catch (err: any) {
      setErrors({ general: err?.message || "Failed to update profile. Please verify all fields." });
    } finally { setLoading(false); }
  };

  const leave = useCallback(() => {
    allowLeave.current = true;
    const action = leaveAction;
    setLeaveAction(null);
    if (action) navigation.dispatch(action);
  }, [leaveAction, navigation]);

  const avatarUrl = setup?.account?.image || session?.user?.image;
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreenHeader title="Edit Profile" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          {errors.general ? <View style={styles.errorBox}><Text style={styles.errorText}>{errors.general}</Text></View> : null}
          <Text style={styles.section}>You</Text>
          <ProfileEditPhotoRow avatarUrl={avatarUrl} initial={(personName || "S")[0].toUpperCase()} uploading={avatar.uploading} onPress={avatar.openSheet} />
          <InputComponent label="Your Full Name" placeholder="e.g. Juan dela Cruz" value={personName} error={errors.personName} onChangeText={change(setPersonName, "personName")} />
          <Text style={[styles.section, styles.sectionGap]}>Your Stall</Text>
          <InputComponent label="Stall Name" placeholder="e.g. Dela Cruz Fresh Produce" value={shopName} error={errors.shopName} onChangeText={change(setShopName, "shopName")} />
          <Text style={styles.fieldLabel}>Stall Location on Map</Text>
          <MapPickerComponent initialCoordinates={coordinates} error={errors.coordinates}
            onCoordinatesChange={(next) => { setCoordinates(next); setErrors((prev) => ({ ...prev, coordinates: undefined, general: undefined })); }} />
          <Text style={styles.hint}>Drag the pin or tap the map to place your stall.</Text>
          <InputComponent label="Address" placeholder="Stall details" multiline numberOfLines={2} value={detailAddress} error={errors.detailAddress} onChangeText={change(setDetailAddress, "detailAddress")} />
          <InputComponent label="Contact Phone" placeholder="09123456789" keyboardType="phone-pad" value={phoneNumber} error={errors.phoneNumber} onChangeText={change(setPhoneNumber, "phoneNumber")} />
        </ScrollView>
        <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <ButtonComponent title="Save Changes" icon={<Check size={18} color={colors.white} />} onPress={() => void save()} loading={loading} />
        </View>
      </KeyboardAvoidingView>
      <ProfilePhotoSheet visible={avatar.sheetOpen} onTake={avatar.takePhoto} onChoose={avatar.choosePhoto} onClose={avatar.closeSheet} />
      <ConfirmDialogComponent visible={Boolean(leaveAction)} icon={<AlertTriangle size={22} color={profileColors.red} />} title="Leave without saving?"
        message="You have changes that haven't been saved. If you leave now, they will be lost." cancelLabel="Keep Editing" confirmLabel="Leave" onCancel={() => setLeaveAction(null)} onConfirm={leave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: profileColors.cream },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.xl },
  section: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text, marginBottom: spacing.md },
  sectionGap: { marginTop: spacing.lg },
  fieldLabel: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text, marginBottom: spacing.xs },
  hint: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.base },
  errorBox: { backgroundColor: profileColors.redSoft, borderWidth: 1, borderColor: colors.error, borderRadius: 10, padding: spacing.md, marginBottom: spacing.base },
  errorText: { color: colors.error, fontFamily: fonts.body.medium, fontSize: 13 },
  bar: { paddingHorizontal: spacing.base, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: profileColors.border },
});
