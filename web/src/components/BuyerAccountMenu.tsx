"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { ConfirmationModalComponent } from "./ConfirmationModalComponent";
import { BUYER_PROFILE_IMAGE_UPDATED_EVENT, getBuyerProfile } from "@/src/features/profile/api/profile";

export function BuyerAccountMenu({ onActionComplete }: { onActionComplete?: () => void }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  // Same placeholder on server and first client render, so hydration matches.
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    const sessionImage = session?.user?.image ?? null;
    if (!userId) { setProfileImage(null); return; }
    let cancelled = false;
    setProfileImage(sessionImage);
    getBuyerProfile()
      .then((res) => { if (!cancelled) setProfileImage(res.account.image); })
      .catch(() => { if (!cancelled) setProfileImage(sessionImage); });
    return () => { cancelled = true; };
  }, [session?.user?.id, session?.user?.image]);

  useEffect(() => { setProfileImageFailed(false); }, [profileImage]);

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
    setSigningOut(true);
    try {
      await authClient.signOut();
      setShowSignOutModal(false);
      setProfileOpen(false);
      onActionComplete?.();
      router.replace("/marketplace");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  if (!mounted || isPending) {
    return <span className="h-10 w-10 animate-pulse rounded-full bg-muted sm:w-24 sm:rounded-xl" aria-label="Checking account" />;
  }

  if (session?.user) {
    return (
      <div ref={profileMenuRef} className="relative">
        <Button
          type="button"
          variant="ghost"
          className="buyer-account-pill flex min-h-10 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 max-sm:border-0 max-sm:bg-transparent max-sm:px-0 max-sm:hover:bg-transparent"
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
              className="size-7 rounded-full object-cover ring-2 ring-primary/25"
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
            className="absolute right-0 top-full z-50 mt-2.5 w-56 sm:w-60 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2 shadow-md animate-in fade-in-0 zoom-in-95 duration-150"
          >
            <div className="truncate border-b border-neutral-100 px-3.5 py-2 text-xs font-semibold text-neutral-400 select-none">
              {session.user.name || session.user.email}
            </div>

            <div className="mt-1 flex flex-col gap-0.5">
              <Link
                href="/orders"
                role="menuitem"
                onClick={() => { setProfileOpen(false); onActionComplete?.(); }}
                className="group flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:bg-[#457D00]/10 hover:text-[#457D00] active:bg-[#457D00]/10 cursor-pointer outline-none"
              >
                <Package aria-hidden="true" className="size-4 shrink-0 text-neutral-500 transition-colors group-hover:text-[#457D00]" />
                <span>All Orders</span>
              </Link>

              <Link
                href="/favorites"
                role="menuitem"
                title="View your saved favorite produce"
                onClick={() => { setProfileOpen(false); onActionComplete?.(); }}
                className="group flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:bg-[#FEA938]/10 hover:text-[#D97706] active:bg-[#FEA938]/10 cursor-pointer outline-none"
              >
                <Heart aria-hidden="true" className="size-4 shrink-0 text-neutral-500 transition-colors group-hover:text-[#FEA938]" />
                <span>Favorites</span>
              </Link>

              <Link
                href="/profile"
                role="menuitem"
                onClick={() => { setProfileOpen(false); onActionComplete?.(); }}
                className="group flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:bg-[#457D00]/10 hover:text-[#457D00] active:bg-[#457D00]/10 cursor-pointer outline-none"
              >
                <User aria-hidden="true" className="size-4 shrink-0 text-neutral-500 transition-colors group-hover:text-[#457D00]" />
                <span>Profile &amp; settings</span>
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  setShowSignOutModal(true);
                }}
                className="group flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 active:bg-red-100 cursor-pointer outline-none text-left"
              >
                <LogOut aria-hidden="true" className="size-4 shrink-0 text-neutral-500 transition-colors group-hover:text-red-600" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        ) : null}

        <ConfirmationModalComponent
          open={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
          onConfirm={signOut}
          loading={signingOut}
          variant="destructive"
          title="Sign Out"
          description="Are you sure you want to sign out of your account?"
          confirmLabel="Sign out"
          cancelLabel="No"
        />
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Link
        href="/login"
        className="buyer-guest-signin inline-flex min-h-10 items-center whitespace-nowrap rounded-xl px-3.5 text-xs font-semibold text-agrivive-muted hover:bg-agrivive-background hover:text-agrivive-primary"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="buyer-guest-register inline-flex min-h-10 items-center rounded-xl bg-agrivive-primary px-4 text-xs font-semibold text-white shadow-sm transition-[background-color,transform] hover:bg-agrivive-primaryPressed active:scale-[0.98]"
      >
        Register
      </Link>
    </div>
  );
}
