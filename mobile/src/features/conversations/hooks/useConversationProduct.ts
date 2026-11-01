import { useEffect, useState } from "react";
import { fetchSellerProduct } from "../../inventory/api/products";
import type { Product } from "../../inventory/types";

/** The listing a chat is about, for its price and stock. Null while loading or if it cannot be read. */
export function useConversationProduct(productId?: string | null) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }
    let active = true;
    fetchSellerProduct(productId).then((data) => { if (active) setProduct(data); }).catch(() => { if (active) setProduct(null); });
    return () => { active = false; };
  }, [productId]);

  return product;
}
