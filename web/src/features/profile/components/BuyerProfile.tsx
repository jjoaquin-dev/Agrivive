"use client";

import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/src/components/PageContainer";
import { authClient } from "@/src/lib/auth-client";
import { getBuyerProfile } from "../api/profile";
import { ProfilePictureCard } from "./ProfilePictureCard";
import { ProfileBasicInfoCard } from "./ProfileBasicInfoCard";
import { ProfileSecurityCard } from "./ProfileSecurityCard";
import { ProfileTwoFactorCard } from "./ProfileTwoFactorCard";
import { ProfileNotificationsCard } from "./ProfileNotificationsCard";
import { ProfileFollowedSellers } from "./ProfileFollowedSellers";
import { ProfileSidebar, type ProfileSection } from "./ProfileSidebar";
import { ProfileStats } from "./ProfileStats";

export function BuyerProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [section, setSection] = useState<ProfileSection>("profile");

  // The "Manage notifications" link in the bell opens /profile#notifications.
  useEffect(() => {
    if (window.location.hash === "#notifications") setSection("notifications");
  }, []);

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
      <main className="min-h-[calc(100vh-72px)] bg-[#F8F6F1] py-8">
        <PageContainer>
          <div className="h-64 animate-pulse rounded-3xl bg-neutral-100" />
        </PageContainer>
      </main>
    );
  }

  const name = session.user.name || "Buyer";
  const initials = (session.user.name || session.user.email || "B")
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#F8F6F1] py-6 text-foreground sm:py-10">
      <PageContainer>
        <Breadcrumbs items={[{ label: "Settings" }]} />

        <div className="mt-4 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <ProfileSidebar
            active={section}
            onSelect={setSection}
            name={name}
            email={session.user.email}
            imageUrl={profileImage}
            initials={initials}
          />

          <div className="flex min-w-0 flex-col gap-6">
            {section === "profile" && (
              <>
                <ProfileStats />
                <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
                  <ProfilePictureCard
                    imageUrl={profileImage}
                    initials={initials}
                    name={name}
                    onAvatarUploaded={setProfileImage}
                  />
                  <ProfileBasicInfoCard user={session.user} />
                </div>
              </>
            )}

            {section === "following" && <ProfileFollowedSellers />}

            {section === "security" && (
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

            {section === "notifications" && (
              <div className="flex max-w-xl flex-col gap-6">
                <ProfileNotificationsCard />
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
