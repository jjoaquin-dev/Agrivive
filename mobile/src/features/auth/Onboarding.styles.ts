import { Dimensions, StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
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
    width: 120,
    height: 35,
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
    fontSize: 28,
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
    backgroundColor: colors.border,
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
