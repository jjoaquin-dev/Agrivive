"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import {
  BUYER_PROFILE_IMAGE_UPDATED_EVENT,
  getBuyerProfile,
} from "@/src/features/profile/api/profile";

interface BuyerAccountMenuProps {
  onActionComplete?: () => void;
}

export function BuyerAccountMenu({ onActionComplete }: BuyerAccountMenuProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFailed, setProfileImageFailed] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id;
    const sessionImage = session?.user?.image ?? null;
    if (!userId) {
      setProfileImage(null);
      return;
    }
    let cancelled = false;
    setProfileImage(sessionImage);
    getBuyerProfile()
      .then((res) => {
        if (!cancelled) setProfileImage(res.account.image);
      })
      .catch(() => {
        if (!cancelled) setProfileImage(sessionImage);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, session?.user?.image]);

  useEffect(() => {
    setProfileImageFailed(false);
  }, [profileImage]);

  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const url = (e as CustomEvent<string>).detail;
      if (url) setProfileImage(url);
    };
    window.addEventListener(BUYER_PROFILE_IMAGE_UPDATED_EVENT, handleProfileUpdate);
    return () => window.removeEventListener(BUYER_PROFILE_IMAGE_UPDATED_EVENT, handleProfileUpdate);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const closeOnOutside = (e: PointerEvent) => {
      if (!profileMenuRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, [profileOpen]);

  async function signOut() {
    await authClient.signOut();
    setProfileOpen(false);
    onActionComplete?.();
    router.replace("/marketplace");
    router.refresh();
  }

  if (isPending) {
    return <span className="h-10 w-24 animate-pulse rounded-xl bg-muted" aria-label="Checking account" />;
  }

  if (session?.user) {
    return (
      <div ref={profileMenuRef} className="relative">
        <Button
          type="button"
          variant="ghost"
          className="flex min-h-10 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5"
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          aria-controls="buyer-profile-menu"
          onClick={() => setProfileOpen((open) => !open)}
        >
          {profileImage && !profileImageFailed ? (
            <img
              src={profileImage}
              alt={`Profile photo for ${session.user.name || "buyer"}`}
              className="size-7 rounded-lg object-cover ring-2 ring-primary/25"
              onError={() => setProfileImageFailed(true)}
            />
          ) : (
            <User aria-hidden="true" className="size-4 text-agrivive-primary" />
          )}
          <span className="hidden max-w-28 truncate text-xs font-semibold sm:inline">
            {session.user.name || "Account"}
          </span>
        </Button>
        {profileOpen ? (
          <div
            id="buyer-profile-menu"
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg"
          >
            <p className="truncate px-3 py-2 text-xs text-muted-foreground">
              {session.user.name || session.user.email}
            </p>
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => { setProfileOpen(false); onActionComplete?.(); }}
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted"
            >
              <User aria-hidden="true" className="size-4" />Profile &amp; settings
            </Link>
            <Link
              href="/notifications"
              role="menuitem"
              onClick={() => { setProfileOpen(false); onActionComplete?.(); }}
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted"
            >
              <Bell aria-hidden="true" className="size-4" />Notifications
            </Link>
            <Link
              href="/messages"
              role="menuitem"
              onClick={() => { setProfileOpen(false); onActionComplete?.(); }}
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted"
            >
              <MessageCircle aria-hidden="true" className="size-4" />Messages
            </Link>
            <Button
              type="button"
              role="menuitem"
              variant="ghost"
              size="sm"
              onClick={() => void signOut()}
              className="w-full justify-start"
            >
              <LogOut data-icon="inline-start" />Sign out
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="inline-flex min-h-10 items-center rounded-xl px-3.5 text-xs font-semibold text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="inline-flex min-h-10 items-center rounded-xl bg-agrivive-primary px-4 text-xs font-semibold text-white shadow-xs transition-[background-color,transform] hover:bg-agrivive-primaryPressed active:scale-[0.98]"
      >
        Register
      </Link>
    </div>
  );
}
