"use client";

import Link from "next/link";
import { Bell, ClipboardList, Heart, KeyRound, MessageSquare, ShieldCheck, Store, User } from "lucide-react";

export type ProfileSection = "profile" | "following" | "security" | "notifications";

const SECTIONS: { key: ProfileSection; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "following", label: "Followed Sellers", icon: Store },
  { key: "security", label: "Security & 2FA", icon: KeyRound },
  { key: "notifications", label: "Pickup & Restock Notifications", icon: Bell },
];

const LINKS = [
  { href: "/orders", label: "My Orders", icon: ClipboardList },
  { href: "/favorites", label: "Saved Items", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

const card = "rounded-3xl border border-[#E5E2DA] bg-white shadow-[0_4px_20px_rgba(20,35,26,0.05)]";
const item = "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition-colors cursor-pointer";

export function ProfileSidebar({ active, onSelect, name, email, imageUrl, initials }: {
  active: ProfileSection;
  onSelect: (section: ProfileSection) => void;
  name: string;
  email: string;
  imageUrl: string | null;
  initials: string;
}) {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24" aria-label="Account menu">
      <div className={`${card} p-5`}>
        <div className="flex items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EEF5E3] font-heading text-base font-bold text-[#457D00]">
            {imageUrl ? <img src={imageUrl} alt="" className="size-full object-cover" /> : initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-bold text-neutral-900">{name}</p>
            <p className="truncate text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#16A34A]">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> Verified Buyer
        </span>
      </div>

      <nav className={`${card} p-3`}>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map(({ key, label, icon: Icon }) => (
            <li key={key} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => onSelect(key)}
                aria-current={active === key ? "page" : undefined}
                className={`${item} ${active === key ? "bg-[#EEF5E3] text-[#25431D] shadow-[inset_3px_0_0_#457D00]" : "text-neutral-700 hover:bg-neutral-50"}`}
              >
                <Icon className={`size-4 shrink-0 ${active === key ? "text-[#457D00]" : "text-neutral-400"}`} aria-hidden="true" />
                <span className="whitespace-nowrap lg:whitespace-normal">{label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="my-2 hidden h-px bg-neutral-100 lg:block" />
        <ul className="hidden lg:block">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className={`${item} text-neutral-700 hover:bg-neutral-50`}>
                <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
