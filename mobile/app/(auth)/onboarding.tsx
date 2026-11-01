import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { colors, fonts, spacing, radii, touchTargets } from "../../src/theme";
import { ArrowRight } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    title: "Sell your extra vegetables",
    description:
      "List what you have left. Buyers nearby can reserve it and pick it up at your stall.",
    image: require("../../assets/onboarding/onboarding-1.png"),
  },
  {
    id: "2",
    title: "Keep track of orders",
    description:
      "We save the vegetables for each buyer, so you know what to pack before they come.",
    image: require("../../assets/onboarding/onboarding-2.png"),
  },
  {
    id: "3",
    title: "Easy pickup",
    description:
      "Scan the buyer's QR code at your stall to finish the handover.",
    image: require("../../assets/onboarding/onboarding-3.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.push("/(auth)/register");
  };

  const handleAlreadyHaveAccount = async () => {
    await completeOnboarding();
    router.push("/(auth)/login");
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleAlreadyHaveAccount();
  };

  const handleMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/brand/Agrivive_Logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Agrivive Logo"
          />
          <Text style={styles.logoText}>Agrivive</Text>
        </View>
        <Pressable
          onPress={handleSkip}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.heroContainer}>
              <Image source={item.image} style={styles.heroImage} resizeMode="cover" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                index === currentIndex ? styles.indicatorActive : null,
              ]}
            />
          ))}
        </View>

        <ButtonComponent
          title={isLastSlide ? "Get started" : "Next"}
          icon={<ArrowRight size={18} color={colors.white} />}
          onPress={handleNext}
          style={styles.mainButton}
        />

        <Pressable
          onPress={handleAlreadyHaveAccount}
          hitSlop={8}
          accessibilityRole="button"
          style={styles.loginLinkWrapper}
        >
          <Text style={styles.loginLinkText}>I already have an account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    height: 56,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  skipText: {
    fontFamily: fonts.body.semiBold,
    color: colors.primary,
    fontSize: 16,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  heroContainer: {
    width: SCREEN_WIDTH - spacing.base * 2,
    height: 360,
    borderRadius: radii.card,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
    marginTop: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 26,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  description: {
    fontFamily: fonts.body.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  mainButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: radii.button,
  },
  loginLinkWrapper: {
    marginTop: spacing.base,
    paddingVertical: spacing.xs,
    alignItems: "center",
  },
  loginLinkText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 15,
    color: colors.primary,
    textAlign: "center",
  },
});
