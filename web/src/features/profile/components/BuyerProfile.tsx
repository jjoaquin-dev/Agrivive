"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, KeyRound, Search, ShieldCheck, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/src/components/PageContainer";
import { authClient } from "@/src/lib/auth-client";
import { listBuyerOrders } from "@/src/features/orders/api/orders";
import { getBuyerProfile } from "../api/profile";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { ProfilePictureCard } from "./ProfilePictureCard";
import { ProfileBasicInfoCard } from "./ProfileBasicInfoCard";
import { ProfileOrdersSummaryCard } from "./ProfileOrdersSummaryCard";
import { ProfileSecurityCard } from "./ProfileSecurityCard";
import { ProfileNotificationsCard } from "./ProfileNotificationsCard";

type SettingsTab = "profile" | "reservations" | "security" | "notifications";

export function BuyerProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
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
      listBuyerOrders()
        .then((res) => { if (!cancelled) setOrders(res.orders); })
        .catch(() => { if (!cancelled) setOrders([]); })
        .finally(() => setOrdersLoading(false));
      getBuyerProfile()
        .then((res) => { if (!cancelled) setProfileImage(res.account.image); })
        .catch(() => { if (!cancelled) setProfileImage(session.user.image ?? null); });
      return () => { cancelled = true; };
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-background py-8">
        <PageContainer>
          <div className="h-64 animate-pulse rounded-3xl bg-card" />
        </PageContainer>
      </main>
    );
  }

  const initials = (session.user.name || session.user.email || "B")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-background py-6 text-foreground sm:py-10">
      <PageContainer>
        {/* Top Header: Settings & Global Save Action */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Verified Buyer
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="h-11 rounded-xl pl-10 text-sm"
            />
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-border/80 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === "profile"
                ? "border-agrivive-primary text-agrivive-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-4" />
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reservations")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === "reservations"
                ? "border-agrivive-primary text-agrivive-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingBag className="size-4" />
            Reservations ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === "security"
                ? "border-agrivive-primary text-agrivive-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="size-4" />
            Security
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === "notifications"
                ? "border-agrivive-primary text-agrivive-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="size-4" />
            Notifications
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

          {activeTab === "reservations" && (
            <ProfileOrdersSummaryCard
              orders={orders}
              loading={ordersLoading}
              pendingCount={pendingCount}
            />
          )}

          {activeTab === "security" && (
            <div className="max-w-xl">
              <ProfileSecurityCard twoFactorEnabled={Boolean(session.user.twoFactorEnabled)} />
            </div>
          )}

          {activeTab === "notifications" && <ProfileNotificationsCard />}
        </div>
      </PageContainer>
    </main>
  );
}
