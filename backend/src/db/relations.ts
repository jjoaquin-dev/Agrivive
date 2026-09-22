import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";
export const relations = defineRelations(schema, (r) => ({
  // =====================================================
  // USER
  // =====================================================
  user: {
    // User as buyer → many orders
    buyerOrders: r.many.orders({
      from: r.user.id,
      to: r.orders.buyersId,
      alias: "buyer_orders",
    }),

    // User as seller → many orders
    sellerOrders: r.many.orders({
      from: r.user.id,
      to: r.orders.sellersId,
      alias: "seller_orders",
    }),

    // Better Auth
    sessions: r.many.session({
      from: r.user.id,
      to: r.session.userId,
    }),

    accounts: r.many.account({
      from: r.user.id,
      to: r.account.userId,
    }),
  },

  // =====================================================
  // ORDERS
  // =====================================================
  orders: {
    // Each order belongs to one buyer
    buyer: r.one.user({
      from: r.orders.buyersId,
      to: r.user.id,
      alias: "buyer_orders",
      optional: false,
    }),

    // Each order belongs to one seller
    seller: r.one.user({
      from: r.orders.sellersId,
      to: r.user.id,
      alias: "seller_orders",
      optional: false,
    }),

    // One order → many order items
    orderItems: r.many.ordered_items({
      from: r.orders.id,
      to: r.ordered_items.ordersId,
    }),
  },

  // =====================================================
  // ORDERED ITEMS
  // =====================================================
  ordered_items: {
    // Each order item belongs to one order
    order: r.one.orders({
      from: r.ordered_items.ordersId,
      to: r.orders.id,
      optional: false,
    }),

    // Each order item belongs to one product
    product: r.one.sellers_product({
      from: r.ordered_items.productId,
      to: r.sellers_product.id,
      optional: false,
    }),
  },

  // =====================================================
  // SELLER PRODUCTS
  // =====================================================
  sellers_product: {
    // Each product belongs to one user/seller
    user: r.one.user({
      from: r.sellers_product.userId,
      to: r.user.id,
      optional: false,
    }),
  },

  // =====================================================
  // SELLER PROFILE
  // =====================================================
  sellers_profile: {
    // Each seller profile belongs to one user
    user: r.one.user({
      from: r.sellers_profile.userId,
      to: r.user.id,
      optional: false,
    }),
  },

  // =====================================================
  // SESSION
  // =====================================================
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
      optional: false,
    }),
  },

  // =====================================================
  // ACCOUNT
  // =====================================================
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
      optional: false,
    }),
  },
}));
