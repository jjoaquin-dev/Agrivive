import { Image as ImageIcon, Package, Store } from "lucide-react";
import type { ConversationLaunchContext } from "../types";

export function ConversationContextCard({ context }: { context: ConversationLaunchContext }) {
  const isProduct = context.contextType === "product";
  const title = isProduct ? context.productName || "Product conversation" : context.contextType === "order" ? "Reservation conversation" : "Direct conversation";

  return (
    <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-border/70 bg-agrivive-background/45 p-3 sm:mx-6">
      {isProduct ? (
        context.productImageUrl ? <img src={context.productImageUrl} alt="" className="size-12 rounded-xl object-cover" /> : <span className="flex size-12 items-center justify-center rounded-xl bg-white text-primary"><ImageIcon className="size-5" aria-hidden="true" /></span>
      ) : <span className="flex size-12 items-center justify-center rounded-xl bg-white text-primary"><Store className="size-5" aria-hidden="true" /></span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">{isProduct ? "About this produce" : "Seller conversation"}</span>
        <span className="mt-0.5 block truncate text-sm font-semibold">{title}</span>
        <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Package className="size-3" aria-hidden="true" />{context.sellerShopName || context.sellerName}</span>
      </span>
    </div>
  );
}
