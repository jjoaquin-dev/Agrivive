import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import {
  createSellerProfile,
  updateSellerPersonalName,
} from "../../../src/api/seller";
import { colors, fonts, spacing } from "../../../src/theme";
import { User, Store, Phone, MapPin, CheckCircle } from "lucide-react-native";
import { CardComponent } from "../../../src/components/CardComponent";
import { InputComponent } from "../../../src/components/InputComponent";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import {
  MapPickerComponent,
  Coordinates,
  DAVAO_CITY_COORDINATES,
} from "../../../src/components/MapPickerComponent";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { session, refreshSetup } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

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

      await refreshSetup();
      router.replace("/(app)/(tabs)/inventory");
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.stepBadge}>Step 3 of 3 • Profile Setup</Text>
            <Text style={styles.title}>Complete Seller Profile</Text>
            <Text style={styles.subtitle}>
              Provide your stall details and location in Davao City to earn your Verified Seller badge.
            </Text>
          </View>

          {errors.general ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Card 1: Personal Contact */}
          <CardComponent style={styles.card}>
            <Text style={styles.cardTitle}>1. Personal Contact</Text>
            <InputComponent
              label="Your Full Name"
              placeholder="e.g. Juan dela Cruz"
              value={personName}
              leftIcon={<User size={18} color={colors.textMuted} />}
              error={errors.personName}
              hint="Used for seller identity verification"
              onChangeText={(text) => {
                setPersonName(text);
                if (errors.personName) setErrors((prev) => ({ ...prev, personName: undefined }));
              }}
            />

            <InputComponent
              label="Phone Number"
              placeholder="09123456789"
              keyboardType="phone-pad"
              value={phoneNumber}
              leftIcon={<Phone size={18} color={colors.textMuted} />}
              error={errors.phoneNumber}
              hint="Buyers contact you regarding reservations"
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
              }}
            />
          </CardComponent>

          {/* Card 2: Stall & Location */}
          <CardComponent style={styles.card}>
            <Text style={styles.cardTitle}>2. Stall & Market Location</Text>
            <InputComponent
              label="Shop or Stall Name"
              placeholder="e.g. Dela Cruz Fresh Veggies"
              value={shopName}
              leftIcon={<Store size={18} color={colors.textMuted} />}
              error={errors.shopName}
              onChangeText={(text) => {
                setShopName(text);
                if (errors.shopName) setErrors((prev) => ({ ...prev, shopName: undefined }));
              }}
            />

            <View style={styles.mapContainer}>
              <Text style={styles.fieldLabel}>Stall Map Location (Davao City)</Text>
              <Text style={styles.fieldHint}>
                Select your public market below or tap the map to place your pin:
              </Text>
              <MapPickerComponent
                initialCoordinates={coordinates}
                error={errors.coordinates}
                onCoordinatesChange={(newCoords, suggestedAddress) => {
                  setCoordinates(newCoords);
                  if (suggestedAddress && !detailAddress.trim()) {
                    setDetailAddress(suggestedAddress);
                  }
                  if (errors.coordinates) setErrors((prev) => ({ ...prev, coordinates: undefined }));
                }}
              />
            </View>

            <InputComponent
              label="Stall Address & Landmarks"
              placeholder="e.g. Stall #14, Vegetable Section, Bankerohan"
              multiline
              numberOfLines={2}
              value={detailAddress}
              leftIcon={<MapPin size={18} color={colors.textMuted} />}
              error={errors.detailAddress}
              onChangeText={(text) => {
                setDetailAddress(text);
                if (errors.detailAddress) setErrors((prev) => ({ ...prev, detailAddress: undefined }));
              }}
            />
          </CardComponent>

          <ButtonComponent
            title="Complete Setup & Get Verified"
            icon={<CheckCircle size={18} color={colors.white} />}
            onPress={handleSaveProfile}
            loading={loading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.base,
  },
  stepBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  card: {
    marginBottom: spacing.base,
    padding: spacing.base,
  },
  cardTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.base,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  fieldHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  mapContainer: {
    marginBottom: spacing.base,
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
  submitButton: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
});
