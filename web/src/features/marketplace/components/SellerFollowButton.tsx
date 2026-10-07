"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BellPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getSellerFollow, removeSellerFollow, saveSellerFollow } from "../api/seller-follows";

export function SellerFollowButton({ sellerId }: { sellerId: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user || sessionPending || session.user.id === sellerId) {
      setFollowing(false);
      setLoading(false);
      setError("");
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void getSellerFollow(sellerId, controller.signal)
      .then((result) => { if (!controller.signal.aborted) setFollowing(result.following); })
      .catch((reason) => {
        if (!isAbortError(reason) && !controller.signal.aborted) {
          setError(reason instanceof ApiError ? reason.message : "Follow status could not load.");
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [sellerId, session?.user?.id, sessionPending]);

  if (session?.user?.id === sellerId) return null;

  async function toggle() {
    if (sessionPending || loading || saving) return;
    if (!session?.user) {
      router.push(`/login?next=${encodeURIComponent(`/sellers/${sellerId}`)}`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = following ? await removeSellerFollow(sellerId) : await saveSellerFollow(sellerId);
      setFollowing(result.following);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Follow could not be updated. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4">
      <Button type="button" variant={following ? "outline" : "default"} onClick={() => void toggle()}
        disabled={sessionPending || loading || saving} aria-pressed={following}
        className="min-h-12 min-w-36 gap-2 rounded-xl">
        {following ? <Check className="size-4" aria-hidden="true" /> : <BellPlus className="size-4" aria-hidden="true" />}
        {saving ? "Saving…" : loading ? "Loading…" : following ? "Following" : "Follow seller"}
      </Button>
      {error ? <p role="alert" className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
