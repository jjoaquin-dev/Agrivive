import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "../theme";

type Props = {
  visible: boolean;
  onRequestClose?: () => void;
  statusBarTranslucent?: boolean;
  children: React.ReactNode;
};

/**
 * Bottom sheet modal. The dim background fades in place and only the sheet slides up,
 * unlike Modal's own "slide", which drags the dim background up with it.
 * Children are the tap-to-close area and the sheet; they must not paint the dim colour themselves.
 */
export function SlideModal({ visible, onRequestClose, statusBarTranslucent, children }: Props) {
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) setMounted(true);
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 280 : 200,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [visible, progress]);

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onRequestClose} statusBarTranslucent={statusBarTranslucent}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.dim, { opacity: progress }]} />
      <Animated.View
        style={[styles.fill, { transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }] }]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { backgroundColor: colors.overlay },
  fill: { flex: 1 },
});
