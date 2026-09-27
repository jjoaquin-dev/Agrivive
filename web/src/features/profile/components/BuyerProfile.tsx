"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart, Store } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/src/components/PageContainer";
import { authClient } from "@/src/lib/auth-client";
import { listBuyerOrders } from "@/src/features/orders/api/orders";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfilePersonalCard } from "./ProfilePersonalCard";
import { ProfileSecurityCard } from "./ProfileSecurityCard";
import { ProfileOrdersSummaryCard } from "./ProfileOrdersSummaryCard";

export function BuyerProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?next=/profile");
      return;
    }
    if (session?.user) {
      listBuyerOrders()
        .then((res) => setOrders(res.orders))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
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

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-background py-6 text-foreground sm:py-10">
      <PageContainer>
        {/* Ambient Profile Hero Banner */}
        <ProfileHeader
          user={session.user}
          pendingCount={pendingCount}
          completedCount={completedCount}
        />

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Left Column: Reservations & Personal Info */}
          <div className="space-y-6">
            <ProfileOrdersSummaryCard
              orders={orders}
              loading={ordersLoading}
              pendingCount={pendingCount}
            />
            <ProfilePersonalCard user={session.user} />
          </div>

          {/* Right Column: Security & Marketplace Actions */}
          <div className="space-y-6">
            <Card className="rounded-2xl p-5 shadow-xs">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Marketplace Shortcuts
              </h3>
              <div className="mt-3 space-y-2">
                <Link
                  href="/marketplace"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full justify-between rounded-xl",
                  })}
                >
                  <span className="flex items-center gap-2">
                    <Store className="size-4 text-primary" />
                    <span>Browse Fresh Produce</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/cart"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full justify-between rounded-xl",
                  })}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="size-4 text-primary" />
                    <span>Shopping Cart</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </div>
            </Card>

            <ProfileSecurityCard twoFactorEnabled={Boolean(session.user.twoFactorEnabled)} />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
