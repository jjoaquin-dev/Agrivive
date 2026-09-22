import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../src/context/AuthContext";
import {
  updateSellerProfile,
  updateSellerPersonalName,
  uploadSellerAvatar,
} from "../../../src/api/seller";
import { colors, fonts, spacing } from "../../../src/theme";
import { User, Store, Phone, MapPin, Check, Camera } from "lucide-react-native";
import { InputComponent } from "../../../src/components/InputComponent";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import {
  MapPickerComponent,
  Coordinates,
  DAVAO_CITY_COORDINATES,
} from "../../../src/components/MapPickerComponent";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { session, setup, refreshSetup } = useAuth();
  const profile = setup?.profile;

  const [personName, setPersonName] = useState(
    setup?.account?.name || session?.user?.name || "",
  );
  const [shopName, setShopName] = useState(profile?.shopName || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || "");
  const [detailAddress, setDetailAddress] = useState(profile?.detailAddress || "");
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: profile?.latitude ?? DAVAO_CITY_COORDINATES.latitude,
    longitude: profile?.longitude ?? DAVAO_CITY_COORDINATES.longitude,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<{
    personName?: string;
    shopName?: string;
    phoneNumber?: string;
    detailAddress?: string;
    coordinates?: string;
    general?: string;
  }>({});

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

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!personName.trim()) {
      newErrors.personName = "Please enter your full name.";
    }
    if (!shopName.trim()) {
      newErrors.shopName = "Please enter your stall or shop name.";
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your contact phone number.";
    } else if (phoneNumber.trim().length < 7) {
      newErrors.phoneNumber = "Please enter a valid phone number (at least 7 digits).";
    }
    if (!detailAddress.trim()) {
      newErrors.detailAddress = "Please enter your stall address.";
    }
    if (!coordinates || typeof coordinates.latitude !== "number") {
      newErrors.coordinates = "Please confirm your stall location on the map.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      // 1. Update personal name if changed
      if (personName.trim() !== (setup?.account?.name || session?.user?.name)) {
        await updateSellerPersonalName(personName);
      }

      // 2. Update stall profile via PATCH /seller/profile
      await updateSellerProfile({
        shopName: shopName.trim(),
        detailAddress: detailAddress.trim(),
        phoneNumber: phoneNumber.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      // 3. Refresh setup state
      await refreshSetup();

      router.back();
    } catch (err: any) {
      console.error("Failed to update seller profile", err);
      setErrors({
        general:
          err?.message || "Failed to update profile. Please verify all fields.",
      });
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = setup?.account?.image || session?.user?.image;
  const sellerInitial = setup?.account?.name
    ? setup.account.name[0].toUpperCase()
    : session?.user?.name
    ? session.user.name[0].toUpperCase()
    : "S";

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Edit stall information</Text>
          <Text style={styles.subtitle}>
            Keep your contact, stall address, and pickup pin updated for buyers.
          </Text>
        </View>

        {errors.general ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {/* Avatar Upload */}
          <View style={styles.avatarSection}>
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
                  <Text style={styles.avatarInitial}>{sellerInitial}</Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                {uploadingAvatar ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Camera size={14} color="white" />
                )}
              </View>
            </Pressable>
            <Text style={styles.avatarHint}>Tap to update profile photo</Text>
          </View>

          <InputComponent
            label="Your Full Name"
            placeholder="e.g. Juan dela Cruz"
            value={personName}
            leftIcon={<User size={18} color={colors.textMuted} />}
            error={errors.personName}
            onChangeText={(text) => {
              setPersonName(text);
              if (errors.personName) setErrors((prev) => ({ ...prev, personName: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <InputComponent
            label="Stall or Shop Name"
            placeholder="e.g. Dela Cruz Fresh Produce"
            value={shopName}
            leftIcon={<Store size={18} color={colors.textMuted} />}
            error={errors.shopName}
            onChangeText={(text) => {
              setShopName(text);
              if (errors.shopName) setErrors((prev) => ({ ...prev, shopName: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <InputComponent
            label="Contact Phone"
            placeholder="09123456789"
            keyboardType="phone-pad"
            value={phoneNumber}
            leftIcon={<Phone size={18} color={colors.textMuted} />}
            error={errors.phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <InputComponent
            label="Stall Address & Landmark"
            placeholder="Stall details"
            multiline
            numberOfLines={2}
            value={detailAddress}
            leftIcon={<MapPin size={18} color={colors.textMuted} />}
            error={errors.detailAddress}
            onChangeText={(text) => {
              setDetailAddress(text);
              if (errors.detailAddress) setErrors((prev) => ({ ...prev, detailAddress: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
          />

          <View style={styles.mapSection}>
            <Text style={styles.sectionLabel}>Stall Location Pin</Text>
            <Text style={styles.sectionHint}>
              Drag the pin or tap on the map to adjust your confirmed pickup location.
            </Text>
            <MapPickerComponent
              initialCoordinates={coordinates}
              error={errors.coordinates}
              onCoordinatesChange={(newCoords) => {
                setCoordinates(newCoords);
                if (errors.coordinates) setErrors((prev) => ({ ...prev, coordinates: undefined }));
                if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
              }}
            />
          </View>

          <ButtonComponent
            title="Save Changes"
            icon={<Check size={18} color={colors.white} />}
            onPress={handleUpdate}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.base,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: "rgba(184, 84, 80, 0.1)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorBoxText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "500",
  },
  form: {
    marginBottom: spacing.xl,
  },
  mapSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "visible",
    position: "relative",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: fonts.heading.bold,
    fontSize: 28,
    color: colors.white,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarHint: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.body.regular,
  },
});
