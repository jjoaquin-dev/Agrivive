import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MessageSellerButton({
  context,
  id,
  compact = false,
}: {
  context: "product" | "seller";
  id: string;
  compact?: boolean;
}) {
  const query = context === "product" ? `productId=${encodeURIComponent(id)}` : `sellerId=${encodeURIComponent(id)}`;

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
