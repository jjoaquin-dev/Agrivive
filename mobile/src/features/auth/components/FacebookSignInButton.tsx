import React, { useState } from "react";
import { StyleSheet, View, Pressable, ActivityIndicator, Alert } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { authClient } from "../../../api/client";

function FacebookIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="12" fill="#1877F2" />
      <Path
        d="M15.12 12.01h-2.12v7.99h-3.32v-7.99H7.95V9.19h1.73V7.32c0-2.4 1.43-3.73 3.6-3.73 1.04 0 2.13.19 2.13.19v2.36h-1.2c-1.19 0-1.56.74-1.56 1.51v1.54h2.64l-.17 2.82z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

export function FacebookSignInButton() {
  const [loading, setLoading] = useState(false);

  const handleFacebookSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await authClient.signIn.social({
        provider: "facebook" as any,
        callbackURL: "/",
      });
      if (response?.error) {
        Alert.alert(
          "Facebook Sign-In",
          "Facebook sign-in is not available right now. Please continue with Google or your email.",
        );
      }
    } catch {
      Alert.alert(
        "Facebook Sign-In",
        "Facebook sign-in is not available right now. Please continue with Google or your email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => void handleFacebookSignIn()}
        style={({ pressed }) => [
          styles.circleButton,
          pressed && styles.circlePressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Sign in with Facebook"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#1877F2" />
        ) : (
          <FacebookIcon size={24} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  circlePressed: {
    backgroundColor: "#F9FAFB",
    transform: [{ scale: 0.96 }],
  },
});
