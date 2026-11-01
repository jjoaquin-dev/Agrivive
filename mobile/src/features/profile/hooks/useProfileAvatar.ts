import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadSellerAvatar } from "../../../api/seller";
import { useAuth } from "../../../context/AuthContext";

/** The Profile Photo sheet and the upload behind it, shared by Profile and Edit Profile. */
export function useProfileAvatar() {
  const { refreshSetup } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (uri: string) => {
    setUploading(true);
    try {
      await uploadSellerAvatar(uri);
      await refreshSetup();
    } catch (err: any) {
      Alert.alert("Upload Failed", err?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  }, [refreshSetup]);

  const takePhoto = useCallback(async () => {
    setSheetOpen(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission Required", "Camera permission is required.");
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!res.canceled && res.assets?.[0]?.uri) await upload(res.assets[0].uri);
  }, [upload]);

  const choosePhoto = useCallback(async () => {
    setSheetOpen(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission Required", "Photo library permission is required.");
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!res.canceled && res.assets?.[0]?.uri) await upload(res.assets[0].uri);
  }, [upload]);

  return { sheetOpen, openSheet: () => setSheetOpen(true), closeSheet: () => setSheetOpen(false), takePhoto, choosePhoto, uploading };
}
