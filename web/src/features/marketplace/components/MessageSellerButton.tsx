import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MessageSellerButton({
  context,
  id,
  compact = false,
  iconOnly = false,
}: {
  context: "product" | "seller";
  id: string;
  compact?: boolean;
  iconOnly?: boolean;
}) {
  const query = context === "product" ? `productId=${encodeURIComponent(id)}` : `sellerId=${encodeURIComponent(id)}`;

  if (iconOnly) {
    return (
      <Link
        href={`/messages?${query}`}
        title="Message seller"
        className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-[#16A34A] hover:border-[#16A34A]/50 hover:bg-neutral-50 shadow-sm transition-colors cursor-pointer"
      >
        <MessageCircle className="size-4.5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link
      href={`/messages?${query}`}
      className={cn(buttonVariants({ variant: "outline", size: compact ? "sm" : "default" }), "gap-2 rounded-xl border-primary/25 text-primary hover:border-primary/50 hover:bg-agrivive-background")}
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      Message seller
    </Link>
  );
}
