"use client";

import { useState } from "react";
import { Check, Copy, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileTwoFactorBackupCodesProps {
  backupCodes: string[];
  onFinish: () => void;
  title?: string;
}

export function ProfileTwoFactorBackupCodes({
  backupCodes,
  onFinish,
  title = "Save Your Backup Codes",
}: ProfileTwoFactorBackupCodesProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!backupCodes.length) return;
    await navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleDownload() {
    if (!backupCodes.length) return;
    const content = [
      "Agrivive Two-Factor Authentication Backup Codes",
      "Created: " + new Date().toLocaleString(),
      "",
      "Store these one-time recovery codes in a safe place.",
      "Each code can only be used once if you lose access to your authenticator app.",
      "",
      ...backupCodes.map((code, idx) => `${idx + 1}. ${code}`),
      "",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrivive-backup-codes.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5 pt-4">
      <div className="space-y-1">
        <h3 className="font-heading text-base font-bold text-neutral-900">{title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          If you lose access to your phone or authenticator app, you can use these one-time codes
          to sign in. Each code can be used only once.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/80 bg-neutral-50/70 p-3.5">
        {backupCodes.map((code, index) => (
          <div
            key={index}
            className="flex items-center justify-center rounded-xl border border-border/60 bg-white px-3 py-2 text-center font-mono text-xs font-semibold text-neutral-800 shadow-2xs"
          >
            {code}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-10 rounded-full border-border/90 px-4 text-xs font-medium text-neutral-700"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-600" />
              <span>Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-muted-foreground" />
              <span>Copy All Codes</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="h-10 rounded-full border-border/90 px-4 text-xs font-medium text-neutral-700"
        >
          <Download className="size-3.5 text-muted-foreground" />
          <span>Download as .txt</span>
        </Button>
      </div>

      <div className="pt-1">
        <Button
          type="button"
          onClick={onFinish}
          className="h-11 w-full rounded-full bg-[#386600] px-5 text-xs font-bold text-white hover:bg-[#386600]/90"
        >
          <ShieldCheck className="size-4" />
          <span>I Have Saved My Backup Codes</span>
        </Button>
      </div>
    </div>
  );
}
