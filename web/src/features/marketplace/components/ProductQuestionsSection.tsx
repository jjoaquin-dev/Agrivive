import { MessageCircle } from "lucide-react";
import { MessageSellerButton } from "./MessageSellerButton";

export function ProductQuestionsSection({ productId, productName }: { productId: string; productName: string }) {
  return (
    <section aria-labelledby="product-message-heading">
      <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5 text-[#457D00]" aria-hidden="true" />
            <h2 id="product-message-heading" className="font-heading text-[18px] font-semibold text-[#14231A]">
              Have a question about {productName}?
            </h2>
          </div>
          <p className="max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
            Message the seller to ask for the latest picture, check availability, or confirm pickup details.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 shrink-0">
          <MessageSellerButton context="product" id={productId} compact />
        </div>
      </div>
    </section>
  );
}
