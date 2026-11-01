import type { Href, useRouter } from "expo-router";

type Router = ReturnType<typeof useRouter>;

export function safeBack(router: Router, fallback: Href = "/(app)/(tabs)/home") {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
