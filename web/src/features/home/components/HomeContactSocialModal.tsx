"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";

interface HomeContactSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const socialChannels = [
  {
    name: "Facebook",
    handle: "@AgriviveDavao",
    description: "Instant Messenger & Community Updates",
    url: "https://facebook.com",
    badge: "Active Daily",
    badgeStyle: "bg-[#457D00]/10 text-[#457D00] border-[#457D00]/20",
    iconBg: "bg-[#457D00] text-white",
    cardHover: "hover:border-[#457D00] hover:bg-[#F7FAF2]",
    actionHover: "group-hover:bg-[#457D00] group-hover:text-white",
    icon: (
      <svg className="size-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    handle: "@agrivive.ph",
    description: "Daily Harvest Stories & Direct Messages",
    url: "https://instagram.com",
    badge: "Fast Response",
    badgeStyle: "bg-[#FEA938]/15 text-[#B45309] border-[#FEA938]/30",
    iconBg: "bg-gradient-to-br from-[#FEA938] to-[#E99525] text-white",
    cardHover: "hover:border-[#FEA938] hover:bg-[#FFFBF5]",
    actionHover: "group-hover:bg-[#FEA938] group-hover:text-neutral-900",
    icon: (
      <svg className="size-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    handle: "@AgrivivePH",
    description: "Real-time Surplus Alerts & Inquiries",
    url: "https://x.com",
    badge: "Official Channel",
    badgeStyle: "bg-[#457D00]/10 text-[#457D00] border-[#457D00]/20",
    iconBg: "bg-[#457D00] text-white",
    cardHover: "hover:border-[#457D00] hover:bg-[#F7FAF2]",
    actionHover: "group-hover:bg-[#457D00] group-hover:text-white",
    icon: (
      <svg className="size-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function HomeContactSocialModal({ isOpen, onClose }: HomeContactSocialModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-neutral-200/80 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Brand Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#457D00] via-[#96B125] to-[#FEA938]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="mt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#457D00]/10 px-3.5 py-1 font-heading text-xs font-bold uppercase tracking-wider text-[#457D00] border border-[#457D00]/15">
            <span className="size-1.5 rounded-full bg-[#457D00] animate-pulse" />
            Connect with Agrivive
          </span>
          <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Message Us on Social Media
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
            Have questions about surplus listings or vendor onboarding? Message us directly on our official accounts and our Davao team will get back to you promptly:
          </p>
        </div>

        {/* Social Cards List */}
        <div className="mt-6 space-y-3">
          {socialChannels.map((channel) => (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 transition-all duration-200 ${channel.cardHover} hover:bg-white hover:shadow-md cursor-pointer`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${channel.iconBg}`}>
                  {channel.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-bold text-neutral-900 group-hover:text-[#457D00] transition-colors">
                      {channel.name}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold border shadow-sm ${channel.badgeStyle}`}>
                      {channel.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#457D00]">{channel.handle}</p>
                  <p className="text-xs text-neutral-500">{channel.description}</p>
                </div>
              </div>
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-neutral-400 ${channel.actionHover} transition-all shadow-sm border border-neutral-200/50`}>
                <ArrowUpRight className="size-4" />
              </div>
            </a>
          ))}
        </div>

        {/* In-App Alternative Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
          <span>Already registered on Agrivive?</span>
          <Link
            href="/messages"
            onClick={onClose}
            className="inline-flex items-center gap-1 font-heading font-bold text-[#457D00] hover:underline"
          >
            <MessageCircle className="size-3.5" />
            In-App Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
