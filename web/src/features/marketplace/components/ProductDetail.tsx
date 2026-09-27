"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, ShoppingBasket, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sellerTypeLabel } from "../marketplace-labels";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, isAbortError } from "@/src/lib/api";
import { useCart } from "@/src/features/cart/CartProvider";
import { createBuyerOrder } from "@/src/features/orders/api/orders";
import { PageContainer } from "@/src/components/PageContainer";
import { getMarketplaceProduct } from "../api/marketplace";
import type { MarketplaceProduct } from "../types";
import { ProductImage } from "./ProductImage";
import { MarketplacePrice } from "./MarketplacePrice";
import { SellerReviewsSection } from "./SellerReviewsSection";
import { ProductReviewsSection } from "./ProductReviewsSection";
import { ProductQuestionsSection } from "./ProductQuestionsSection";
import { SimilarProduceSection } from "./SimilarProduceSection";

export function ProductDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id ?? "";
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    getMarketplaceProduct(productId, controller.signal)
      .then((result) => {
        if (!active) return;
        setProduct(result);
        const savedQuantity = new URLSearchParams(window.location.search).get("quantity");
        setQuantity(savedQuantity && Number(savedQuantity) > 0 ? savedQuantity : "1");
      })
      .catch((reason: unknown) => {
        if (!active || isAbortError(reason)) return;
        setError(reason instanceof ApiError ? reason.message : "We could not load this listing.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [productId]);

  async function handleBuyNow() {
    if (!product) return;
    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0.01 || parsedQuantity > Number(product.productQty)) {
      setOrderError("Enter a quantity that is available for this listing.");
      return;
    }
    setOrdering(true);
    setOrderError("");
    try {
      const order = await createBuyerOrder(product.id, parsedQuantity, crypto.randomUUID());
      router.push(`/orders/${order.id}`);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) {
        const returnPath = `/marketplace/${product.id}?quantity=${encodeURIComponent(quantity)}`;
        router.push(`/login?next=${encodeURIComponent(returnPath)}`);
        return;
      }
      setOrderError(reason instanceof ApiError ? reason.message : "We could not create the reservation.");
    } finally { setOrdering(false); }
  }

  function handleAddToCart() {
    if (!product) return;
    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0.01 || parsedQuantity > Number(product.productQty)) {
      setCartMessage("Enter a quantity that is available for this listing.");
      return;
    }
    addItem(product, parsedQuantity);
    setCartMessage(`${product.productName} was added to your cart.`);
  }

  if (loading) return <main className="min-h-[calc(100vh-72px)] bg-background p-6"><PageContainer><div className="h-[520px] animate-pulse rounded-2xl bg-card" /></PageContainer></main>;
  if (error || !product) return <main className="min-h-[calc(100vh-72px)] bg-background p-6"><PageContainer><Card className="mx-auto max-w-xl items-center p-8 text-center"><h1 className="font-heading text-2xl font-bold">We could not find that listing.</h1><p className="text-muted-foreground">{error || "It may have been removed or is no longer visible."}</p><Link href="/marketplace" className={cn(buttonVariants(), "mt-2")}><ArrowLeft className="size-4" />Back to marketplace</Link></Card></PageContainer></main>;

  const soldOut = product.availability === "sold_out" || Number(product.productQty) <= 0;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-background py-8 text-foreground lg:py-12">
      <PageContainer>
        <Link href="/marketplace" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft aria-hidden="true" className="size-4" />Back to marketplace</Link>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden p-0"><div className="h-[360px] bg-agrivive-background sm:h-[500px]"><ProductImage src={product.imageUrl} alt={product.productName} category={product.productType} /></div></Card>
          <Card className="gap-5 p-5 sm:p-7">
            <CardHeader className="gap-3 p-0">
              <Badge variant="secondary" className="gap-2"><ShoppingBasket aria-hidden="true" className="size-4" />{product.productType}</Badge>
              <h1 className="font-heading text-3xl font-bold leading-tight">{product.productName}</h1>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-5">
                <MarketplacePrice basePrice={product.basePrice} currentPrice={product.productPrice} unit={product.scalingType} size="detail" />
                <Badge variant={soldOut ? "destructive" : "success"}>{soldOut ? "Sold out" : `${Number(product.productQty).toLocaleString()} ${product.scalingType} available`}</Badge>
              </div>
            </CardHeader>
            <CardContent className="gap-5 p-0">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div><dt className="text-muted-foreground">Seller</dt><dd className="mt-1 font-semibold"><Link href={`/sellers/${product.seller.id}`} className="text-primary hover:underline">{product.seller.shopName}</Link></dd></div>
                <div><dt className="text-muted-foreground">Seller type</dt><dd className="mt-1 font-semibold">{sellerTypeLabel(product.seller.sellerType)}</dd></div>
                <div><dt className="text-muted-foreground">Condition</dt><dd className="mt-1 font-semibold capitalize">{product.condition?.replaceAll("_", " ") || "No condition note"}</dd></div>
              </dl>
              <div className="border-t pt-5 text-sm">
                <h2 className="font-semibold">Pickup details</h2>
                <p className="mt-2 flex items-start gap-2 leading-6 text-muted-foreground"><MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />{product.seller.detailAddress}</p>
                <p className="mt-2 leading-6 text-muted-foreground">{product.seller.pickupInstructions || "Ask the seller for the best pickup time after reserving."}</p>
              </div>
              {orderError ? <Alert variant="destructive"><AlertDescription>{orderError}</AlertDescription></Alert> : null}
              {cartMessage ? <Alert role="status"><AlertDescription>{cartMessage}</AlertDescription></Alert> : null}
              <Field><FieldLabel htmlFor="reservation-quantity">Quantity to reserve</FieldLabel><Input id="reservation-quantity" type="number" min="0.01" max={Number(product.productQty)} step="0.01" value={quantity} onChange={(event) => setQuantity(event.target.value)} disabled={soldOut || ordering} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" variant="outline" onClick={handleAddToCart} disabled={soldOut || ordering} className="h-11"><ShoppingCart aria-hidden="true" data-icon="inline-start" />Add to cart</Button>
                <Button type="button" onClick={handleBuyNow} disabled={soldOut || ordering} className="h-12">{ordering ? "Reserving…" : "Buy now"}</Button>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">Payment happens directly at pickup. Reservations expire after 24 hours.</p>
            </CardContent>
          </Card>
        </div>

        <SellerReviewsSection sellerId={product.seller.id} shopName={product.seller.shopName} />
        <ProductReviewsSection productId={product.id} />
        <ProductQuestionsSection productId={product.id} />
        <SimilarProduceSection currentProductId={product.id} productType={product.productType} />
      </PageContainer>
    </main>
  );
}
