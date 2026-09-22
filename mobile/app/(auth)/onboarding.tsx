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
import { colors, fonts, spacing } from "../../src/theme";
import { ArrowRight } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    title: "Turn surplus into opportunity",
    description:
      "List marketable vegetables, reach nearby buyers, and arrange easy self-pickup.",
    image: require("../../assets/onboarding/onboarding-1.png"),
  },
  {
    id: "2",
    title: "Manage reservations",
    description:
      "Hold stock securely, track incoming orders in real time, and pack produce before buyers arrive.",
    image: require("../../assets/onboarding/onboarding-2.png"),
  },
  {
    id: "3",
    title: "Arrange easy pickup",
    description:
      "Confirm buyer handovers with fast QR verification right at your stall with zero friction.",
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Top Header matching concept mockup */}
      <View style={styles.topBar}>
        <Image
          source={require("../../assets/brand/agrivive-logo-full.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Agrivive Logo"
        />
        <Pressable
          onPress={handleSkip}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Slide Carousel */}
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
            {/* Visual Hero Illustration with soft rounded edges */}
            <View style={styles.heroContainer}>
              <Image
                source={item.image}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>

            {/* Slide Title and Description */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Thumb-Zone Controls */}
      <View style={styles.footer}>
        {/* Circular Indicators matching seller-onboarding-concept-v2 */}
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

        {/* Primary Action Button */}
        <ButtonComponent
          title={currentIndex === SLIDES.length - 1 ? "Get started" : "Next"}
          icon={<ArrowRight size={18} color={colors.white} />}
          onPress={handleNext}
          style={styles.mainButton}
        />

        {/* I already have an account link matching concept mockup */}
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

const HERO_HEIGHT = Math.min(SCREEN_HEIGHT * 0.46, 380);

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
  logo: {
    width: 176,
    height: 44,
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
    height: HERO_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#EFECE4",
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
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 28,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
    lineHeight: 34,
  },
  description: {
    fontFamily: fonts.body.regular,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
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
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  mainButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 12,
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
