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
import { styles } from "../../src/features/auth/Onboarding.styles";

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
    image: require("../../assets/onboarding/onboarding-1.jpg"),
  },
  {
    id: "2",
    title: "Keep track of orders",
    description:
      "We save the vegetables for each buyer, so you know what to pack before they come.",
    image: require("../../assets/onboarding/onboarding-2.jpg"),
  },
  {
    id: "3",
    title: "Easy pickup",
    description:
      "Scan the buyer's QR code at your stall to finish the handover.",
    image: require("../../assets/onboarding/onboarding-3.jpg"),
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
            source={require("../../assets/brand/agrivive-logo-full.png")}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Agrivive"
          />
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
