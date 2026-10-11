import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSellerButton } from "./MessageSellerButton";

export function ProductQuestionsSection({ productId, productName }: { productId: string; productName: string }) {
  return (
    <section className="mt-10 border-t pt-8" aria-labelledby="product-message-heading">
      <Card className="rounded-[20px] border-primary/15 bg-agrivive-background/45 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <CardContent className="gap-2 p-0">
          <div className="flex items-center gap-2"><MessageCircle className="size-5 text-primary" aria-hidden="true" /><h2 id="product-message-heading" className="font-heading text-xl font-bold">Have a question about {productName}?</h2></div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Message the seller to ask for the latest picture, check availability, or confirm pickup details.</p>
        </CardContent>
        <MessageSellerButton context="product" id={productId} compact />
      </Card>
    </section>
  );
}
