import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent, type WebViewProps } from "react-native-webview";
import { recaptchaSiteKey, registerRecaptchaRequester } from "../recaptcha";
import { webUrl } from "../../legal/legalLinks";

const TOKEN_TIMEOUT_MS = 15_000;

const CaptchaWebView = WebView as unknown as React.ComponentType<
  WebViewProps & { ref?: React.Ref<WebView<any>> }
>;

// baseUrl makes Google see the registered web domain, so the site key is accepted in the app.
const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width"></head><body>
<script src="https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}"></script>
<script>
window.runCaptcha = function (id, action) {
  function send(payload) { window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({ id: id }, payload))); }
  if (!window.grecaptcha) return send({ error: "not-loaded" });
  grecaptcha.ready(function () {
    grecaptcha.execute("${recaptchaSiteKey}", { action: action })
      .then(function (token) { send({ token: token }); })
      .catch(function () { send({ error: "failed" }); });
  });
};
</script></body></html>`;

type Pending = { resolve: (token: string) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

export function RecaptchaHost() {
  const webViewRef = useRef<WebView<any> | null>(null);
  const pending = useRef(new Map<number, Pending>());
  const nextId = useRef(1);

  useEffect(() => {
    if (!recaptchaSiteKey) return;
    registerRecaptchaRequester((action) =>
      new Promise<string>((resolve, reject) => {
        const id = nextId.current++;
        const timer = setTimeout(() => {
          pending.current.delete(id);
          reject(new Error("The security check took too long. Check your connection and try again."));
        }, TOKEN_TIMEOUT_MS);
        pending.current.set(id, { resolve, reject, timer });
        webViewRef.current?.injectJavaScript(`window.runCaptcha(${id}, ${JSON.stringify(action)}); true;`);
      }),
    );
    return () => {
      registerRecaptchaRequester(null);
      pending.current.forEach((entry) => clearTimeout(entry.timer));
      pending.current.clear();
    };
  }, []);

  function handleMessage(event: WebViewMessageEvent) {
    let message: { id: number; token?: string; error?: string };
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }
    const entry = pending.current.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer);
    pending.current.delete(message.id);
    if (message.token) entry.resolve(message.token);
    else entry.reject(new Error("The security check could not finish. Check your connection and try again."));
  }

  if (!recaptchaSiteKey) return null;

  return (
    <View style={styles.hidden} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <CaptchaWebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html, baseUrl: webUrl }}
        onMessage={handleMessage}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: { position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" },
});
