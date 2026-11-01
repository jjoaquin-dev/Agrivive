import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clock, CloudOff, LogOut, ShieldAlert, WifiOff } from "lucide-react-native";
import { ButtonComponent } from "../../components/ButtonComponent";
import { ConfirmDialogComponent } from "../../components/ConfirmDialogComponent";
import { AuthTextLink } from "../auth/components/AuthTextLink";
import { maskEmail } from "../auth/maskEmail";
import { colors, fonts, spacing } from "../../theme";
import type { StartProblem } from "./classifyStartProblem";

interface AppProblemScreenProps {
  problem: StartProblem;
  email?: string | null;
  retrying: boolean;
  onRetry: () => void;
  onRestore: () => void;
  onLogOut: () => void;
}

/** One calm screen for every way the app can fail to start. Each one says what happened and offers the next step (Visibility of System Status, Nielsen). */
export const AppProblemScreen: React.FC<AppProblemScreenProps> = ({ problem, email, retrying, onRetry, onRestore, onLogOut }) => {
  const [confirmLogOut, setConfirmLogOut] = useState(false);
  const view = describe(problem);

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        <view.Icon size={40} color={view.color} />
        <Text style={styles.title}>{view.title}</Text>
        <Text style={styles.body}>{view.body}</Text>
        {problem.kind === "paused" && problem.backIn ? (
          <View style={styles.pill}><Text style={styles.pillText}>{`Back in ${problem.backIn}`}</Text></View>
        ) : null}
        {problem.kind === "blocked" ? (
          <ButtonComponent title="Restore My Account" onPress={onRestore} style={styles.button} />
        ) : (
          <ButtonComponent title="Try Again" onPress={onRetry} loading={retrying} style={styles.button} />
        )}
        <AuthTextLink label="Log Out" onPress={() => setConfirmLogOut(true)} />
      </View>
      {email ? <Text style={styles.footer}>{`Signed in as ${maskEmail(email)}`}</Text> : null}
      <ConfirmDialogComponent
        visible={confirmLogOut}
        icon={<LogOut size={22} color={colors.error} />}
        title="Log out of Agrivive?"
        message="You will need to sign in again to manage your stall and produce."
        cancelLabel="Cancel"
        confirmLabel="Log Out"
        onCancel={() => setConfirmLogOut(false)}
        onConfirm={() => { setConfirmLogOut(false); onLogOut(); }}
      />
    </View>
  );
};

function describe(problem: StartProblem) {
  switch (problem.kind) {
    case "offline":
      return { Icon: WifiOff, color: colors.textMuted, title: "No Internet", body: "Check your mobile data or Wi-Fi, then try again." };
    case "server":
      return { Icon: CloudOff, color: colors.terracotta, title: "Agrivive Isn't Responding", body: "This is on our side. Try again in a minute." };
    case "paused":
      return { Icon: Clock, color: colors.warning, title: "Your Account Is Paused", body: problem.reason };
    case "blocked":
      return { Icon: ShieldAlert, color: colors.error, title: "Your Account Is Blocked", body: problem.reason };
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text, marginTop: spacing.base, textAlign: "center" },
  body: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.sm, textAlign: "center" },
  pill: { marginTop: spacing.base, backgroundColor: "#FEF3C7", borderRadius: 9999, paddingHorizontal: 14, paddingVertical: 6 },
  pillText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: "#92400E" },
  button: { alignSelf: "stretch", marginTop: spacing.lg },
  footer: { textAlign: "center", fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, paddingBottom: spacing.lg },
});
