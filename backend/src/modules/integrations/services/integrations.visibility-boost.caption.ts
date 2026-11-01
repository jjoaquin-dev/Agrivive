import type { getVisibilityBoostContext } from "./integrations.visibility-boost.context";

type Context = Awaited<ReturnType<typeof getVisibilityBoostContext>>;

function mentionsPrice(caption: string, price: string) {
  return [price, String(Number(price))].some((form) =>
    new RegExp(`₱\\s?${form.replace(".", "\\.")}(?!\\d|\\.\\d)`).test(caption));
}

function templateCaption(context: Context, postType: string, price: string, previous: number | null) {
  const per = context.product.unit ? ` per ${context.product.unit}` : "";
  if (postType === "first_post") {
    return `Fresh ${context.product.name} is now available at ₱${price}${per} from ${context.seller.shopName}!`;
  }
  const was = previous ? ` (was ₱${previous.toFixed(2)})` : "";
  return `Price drop! ${context.product.name} is now ₱${price}${per}${was} at ${context.seller.shopName}. Get yours before it sells out!`;
}

/** The caption text without a link. Any link the model wrote is dropped, and a caption with the wrong price is replaced. */
export function boostCaptionText(context: Context, postType: string, caption: string, previous: number | null) {
  const price = context.product.price.toFixed(2);
  const written = caption.replace(/https?:\/\/\S+/g, "").replace(/[ \t]+\n/g, "\n").trim();
  return written && mentionsPrice(written, price) ? written : templateCaption(context, postType, price, previous);
}
