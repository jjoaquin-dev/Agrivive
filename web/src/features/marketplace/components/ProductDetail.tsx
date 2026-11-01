"use client";

import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError, isAbortError } from "@/src/lib/api";
import { useCart } from "@/src/features/cart/CartProvider";
import { createBuyerOrder } from "@/src/features/orders/api/orders";
import { getMarketplaceProduct } from "../api/marketplace";
import type { MarketplaceProduct } from "../types";
import { ConfirmationModalComponent } from "@/src/components/ConfirmationModalComponent";
import { ProductImage } from "./ProductImage";
import { ProductInfoCard } from "./ProductInfoCard";
import { SellerReviewsSection } from "./SellerReviewsSection";
import { ProductReviewsSection } from "./ProductReviewsSection";
import { ProductQuestionsSection } from "./ProductQuestionsSection";

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
  const [showReserveModal, setShowReserveModal] = useState(false);
  const { addItem, removeItem } = useCart();

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

  function promptBuyNow() {
    if (!product) return;
    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0.01 || parsedQuantity > Number(product.productQty)) {
      setOrderError("Enter a quantity that is available for this listing.");
      return;
    }
    setOrderError("");
    setShowReserveModal(true);
  }

  async function executeBuyNow() {
    if (!product) return;
    const parsedQuantity = Number(quantity);
    setOrdering(true);
    setOrderError("");
    try {
      const order = await createBuyerOrder(product.id, parsedQuantity, crypto.randomUUID());
      removeItem(product.id);
      setShowReserveModal(false);
      router.push(`/orders/${order.id}`);
    } catch (reason) {
      setShowReserveModal(false);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFDFD] px-6 py-6 text-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="h-[540px] animate-pulse rounded-[16px] border border-[#E8E8E8] bg-white" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#FDFDFD] px-6 py-6 text-foreground">
        <div className="mx-auto max-w-xl rounded-[16px] border border-[#E8E8E8] bg-white p-8 text-center shadow-sm">
          <h1 className="font-heading text-2xl font-bold">We could not find that listing.</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error || "It may have been removed or is no longer visible."}</p>
          <Link href="/marketplace" className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#457D00] px-4 text-sm font-semibold text-white hover:bg-[#386600]">
            <ArrowLeft className="size-4" />Back to Marketplace
          </Link>
        </div>
      </main>
    );
  }

  const soldOut = product.availability === "sold_out" || Number(product.productQty) <= 0;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#FDFDFD] px-4 py-6 sm:px-6 text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Back Navigation Link */}
        <div>
          <Breadcrumbs items={[{ label: "Product", href: "/marketplace" }, { label: product.productName }]} />
        </div>

        {/* Main Product Section: 2:1 Responsive Layout */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {/* Left: Product Image Card (2 parts) */}
          <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E5E2DA] bg-white p-3.5 shadow-xs sm:p-4 lg:col-span-2">
            <div className="relative flex-1 w-full min-h-[380px] sm:min-h-[460px] lg:min-h-0 overflow-hidden rounded-[18px] bg-[#FAFAF8]">
              <ProductImage
                src={product.imageUrl}
                alt={product.productName}
                category={product.productType}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          </div>

          {/* Right: Product Information Card (1 part) */}
          <ProductInfoCard
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            soldOut={soldOut}
            ordering={ordering}
            orderError={orderError}
            cartMessage={cartMessage}
            onAddToCart={handleAddToCart}
            onBuyNow={promptBuyNow}
          />
        </div>

        {/* Reviews, Ratings, and Questions Sections (SimilarProduceSection removed) */}
        <SellerReviewsSection sellerId={product.seller.id} shopName={product.seller.shopName} />
        <ProductReviewsSection productId={product.id} />
        <ProductQuestionsSection productId={product.id} productName={product.productName} />
      </div>

      <ConfirmationModalComponent
        open={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        onConfirm={executeBuyNow}
        loading={ordering}
        variant="positive"
        title="Confirm Reservation"
        description={`Are you sure you want to reserve ${quantity} ${product?.scalingType || "kilo"} of ${product?.productName}? You will pay directly to the stall at pickup.`}
        confirmLabel="Reserve"
        cancelLabel="No"
      />
    </main>
  );
}
