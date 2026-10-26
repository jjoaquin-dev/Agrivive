import { StyleSheet } from "react-native";
import { colors, fonts, radii } from "../../../theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 10,
  },
  cardUrgent: {
    borderColor: "#FB923C",
    backgroundColor: "#FFFBF7",
  },
  cardUnread: {
    borderColor: "#86EFAC",
    backgroundColor: "#F0FDF4",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginRight: 6,
  },
  titleUrgent: {
    color: "#C2410C",
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  timeText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    lineHeight: 18,
    color: "#4B5563",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginLeft: 54,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnGreen: {
    backgroundColor: "#16A34A",
  },
  actionBtnOrange: {
    backgroundColor: "#EA580C",
  },
  actionBtnGray: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionBtnText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: colors.white,
  },
  actionBtnGrayText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: "#374151",
  },
  pressed: {
    opacity: 0.8,
  },
});
