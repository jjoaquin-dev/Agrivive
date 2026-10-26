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
    <div className="inline-flex">
      <Button
        type="button"
        onClick={() => void toggle()}
        disabled={sessionPending || loading || saving}
        aria-pressed={following}
        className={following
          ? "min-h-9 h-9 px-4 gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-800 text-xs font-semibold shadow-2xs hover:bg-neutral-200 cursor-pointer"
          : "min-h-9 h-9 px-4 gap-1.5 rounded-xl bg-[#16A34A] hover:bg-[#137A38] text-white text-xs font-semibold shadow-2xs cursor-pointer"
        }
      >
        {following ? <Check className="size-3.5" aria-hidden="true" /> : <BellPlus className="size-3.5" aria-hidden="true" />}
        {saving ? "Saving…" : loading ? "Loading…" : following ? "Following" : "Follow seller"}
      </Button>
      {error ? <p role="alert" className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
