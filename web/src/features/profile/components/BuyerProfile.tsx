"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, KeyRound, Search, ShieldCheck, User } from "lucide-react";
import { PageContainer } from "@/src/components/PageContainer";
import { authClient } from "@/src/lib/auth-client";
import { getBuyerProfile } from "../api/profile";
import { ProfilePictureCard } from "./ProfilePictureCard";
import { ProfileBasicInfoCard } from "./ProfileBasicInfoCard";
import { ProfileSecurityCard } from "./ProfileSecurityCard";
import { ProfileTwoFactorCard } from "./ProfileTwoFactorCard";
import { ProfileNotificationsCard } from "./ProfileNotificationsCard";

type SettingsTab = "profile" | "security" | "notifications";

export function BuyerProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?next=/profile");
      return;
    }
    if (session?.user) {
      let cancelled = false;
      getBuyerProfile()
        .then((r) => { if (!cancelled) setProfileImage(r.account.image); })
        .catch(() => { if (!cancelled) setProfileImage(session.user.image ?? null); });
      return () => { cancelled = true; };
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#FDFDFD] py-8">
        <PageContainer>
          <div className="h-64 animate-pulse rounded-3xl bg-neutral-100" />
        </PageContainer>
      </main>
    );
  }

  const initials = (session.user.name || session.user.email || "B")
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#FDFDFD] py-6 text-foreground sm:py-10">
      <PageContainer>
        {/* Top Back Navigation Link */}
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="inline-flex min-h-[36px] items-center gap-2 text-[14px] font-medium text-neutral-500 transition-colors hover:text-black cursor-pointer"
          >
            <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
            <span>Back to Marketplace</span>
          </Link>
        </div>

        {/* Top Header: Settings & Verified Badge */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Settings
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-[#16A34A]">
              <ShieldCheck className="size-3.5 text-[#16A34A]" />
              Verified Buyer
            </span>
          </div>
        </div>

        {/* Pill Search Bar (Matching Photo 2) */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="h-11 w-full rounded-full border border-neutral-200/90 bg-white pl-11 pr-5 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-2xs transition-colors focus:border-[#386600] focus:outline-none focus:ring-2 focus:ring-[#386600]/15"
            />
          </div>
        </div>

        {/* System Tab Capsule (Matching Photo 2 - Reservations Removed) */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#F3F5EA] border border-[#E5E9DC] p-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-white text-neutral-900 font-bold shadow-2xs"
                : "text-neutral-600 font-semibold hover:text-neutral-900"
            }`}
          >
            <User className={`size-3.5 ${activeTab === "profile" ? "text-[#386600]" : "text-neutral-400"}`} />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-white text-neutral-900 font-bold shadow-2xs"
                : "text-neutral-600 font-semibold hover:text-neutral-900"
            }`}
          >
            <KeyRound className={`size-3.5 ${activeTab === "security" ? "text-[#386600]" : "text-neutral-400"}`} />
            <span>Security</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs transition-all cursor-pointer ${
              activeTab === "notifications"
                ? "bg-white text-neutral-900 font-bold shadow-2xs"
                : "text-neutral-600 font-semibold hover:text-neutral-900"
            }`}
          >
            <Bell className={`size-3.5 ${activeTab === "notifications" ? "text-[#386600]" : "text-neutral-400"}`} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="mt-8">
          {activeTab === "profile" && (
            <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
              <ProfilePictureCard
                imageUrl={profileImage}
                initials={initials}
                name={session.user.name || "Buyer"}
                onAvatarUploaded={setProfileImage}
              />
              <ProfileBasicInfoCard user={session.user} />
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex max-w-xl flex-col gap-6">
              <ProfileTwoFactorCard
                twoFactorEnabled={Boolean(session.user.twoFactorEnabled)}
                onStatusChange={async () => {
                  await authClient.getSession();
                  router.refresh();
                }}
              />
              <ProfileSecurityCard />
            </div>
          )}

          {activeTab === "notifications" && <ProfileNotificationsCard />}
        </div>
      </PageContainer>
    </main>
  );
}
