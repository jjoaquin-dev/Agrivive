import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, Trash2 } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { uploadProductImage } from "../api/product-images";

interface ProductPhotoFieldProps {
  label?: string;
  initialImageUrl?: string | null;
  initialDisplayUrl?: string | null;
  onImageSelected: (permanentUrl: string, displayUrl: string) => void;
  onImageRemoved?: () => void;
  error?: string;
}

export const ProductPhotoField: React.FC<ProductPhotoFieldProps> = ({
  label = "Product Photo",
  initialImageUrl,
  initialDisplayUrl,
  onImageSelected,
  onImageRemoved,
  error,
}) => {
  const [displayUri, setDisplayUri] = useState<string | null>(
    initialDisplayUrl || initialImageUrl || null,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const performUpload = async (localUri: string) => {
    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadProductImage(localUri);
      setDisplayUri(res.displayUrl);
      onImageSelected(res.imageUrl, res.displayUrl);
    } catch (err: any) {
      console.error("Photo upload error", err);
      const msg = err?.message || "Failed to upload produce photo. Please try again.";
      setUploadError(msg);
      Alert.alert("Upload Failed", msg);
    } finally {
      setUploading(false);
    }
  };

  const handlePickPhoto = () => {
    Alert.alert("Produce Photo", "Add a photo of your fresh vegetable surplus", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Take Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission Required",
              "Camera permission is required to take produce photos.",
            );
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            await performUpload(result.assets[0].uri);
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
              "Photo library permission is required to choose produce photos.",
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
            await performUpload(result.assets[0].uri);
          }
        },
      },
    ]);
  };

  const handleRemove = () => {
    setDisplayUri(null);
    onImageRemoved?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {displayUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: displayUri }} style={styles.previewImage} />
          {uploading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={styles.loadingText}>Uploading photo...</Text>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <Pressable
                onPress={handlePickPhoto}
                accessibilityRole="button"
                accessibilityLabel="Change produce photo"
                style={styles.changeButton}
              >
                <Camera size={16} color={colors.white} />
                <Text style={styles.changeButtonText}>Change</Text>
              </Pressable>
              {onImageRemoved ? (
                <Pressable
                  onPress={handleRemove}
                  accessibilityRole="button"
                  accessibilityLabel="Remove produce photo"
                  style={styles.removeButton}
                >
                  <Trash2 size={16} color={colors.error} />
                </Pressable>
              ) : null}
            </View>
          )}
        </View>
      ) : (
        <Pressable
          onPress={handlePickPhoto}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel="Add produce photo"
          style={({ pressed }) => [
            styles.uploadBox,
            pressed && styles.uploadBoxPressed,
            (error || uploadError) ? styles.uploadBoxError : null,
          ]}
        >
          {uploading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <View style={styles.iconCircle}>
                <Camera size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadPrompt}>Tap to add produce photo</Text>
              <Text style={styles.uploadSubtext}>JPEG, PNG, or WEBP (up to 5MB)</Text>
            </>
          )}
        </Pressable>
      )}

      {error || uploadError ? (
        <Text style={styles.errorText}>{error || uploadError}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  uploadBox: {
    height: 140,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: radii.card,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.base,
  },
  uploadBoxPressed: {
    backgroundColor: "#F3F1EC",
  },
  uploadBoxError: {
    borderColor: colors.error,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  uploadPrompt: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  uploadSubtext: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  previewContainer: {
    height: 180,
    borderRadius: radii.card,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    fontFamily: fonts.body.medium,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  actionRow: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.button,
  },
  changeButtonText: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    marginLeft: 6,
  },
  removeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorText: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
