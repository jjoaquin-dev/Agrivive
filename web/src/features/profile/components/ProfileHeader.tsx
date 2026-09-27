"use client";

import { Calendar, Clock, Mail, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email: string;
    createdAt?: Date | string;
  };
  pendingCount: number;
  completedCount: number;
}

export function ProfileHeader({ user, pendingCount, completedCount }: ProfileHeaderProps) {
  const initials = (user.name || user.email || "B")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-background to-agrivive-background p-5 shadow-xs sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* User Identity */}
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-heading text-lg font-bold text-white shadow-xs ring-2 ring-primary/20">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                {user.name || "Buyer"}
              </h1>
              <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                Verified Buyer
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                Member since {memberYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rebalanced Metrics Strip */}
      <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-border/60 pt-5 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-2xs backdrop-blur-xs dark:bg-card">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Clock className="size-4" />
          </div>
          <div>
            <p className="font-heading text-base font-bold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Active Pickups</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-2xs backdrop-blur-xs dark:bg-card">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="size-4" />
          </div>
          <div>
            <p className="font-heading text-base font-bold text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed Pickups</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-2xs backdrop-blur-xs dark:bg-card">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <MapPin className="size-4" />
          </div>
          <div>
            <p className="font-heading text-xs font-bold text-foreground">Davao City Markets</p>
            <p className="text-xs text-muted-foreground">Primary Location</p>
          </div>
        </div>
      </div>
    </div>
  );
}
