import { apiFetch, apiGet, getPage, type RequestOptions } from "../client";
import type { CreateReviewPayload, Order, PageQuery, Payment, Product, Review } from "@/types/api";

export const accountApi = {
  addWishlist: (productId: number, options?: RequestOptions) =>
    apiFetch<void>(`/api/me/wishlist/${productId}`, undefined, { ...options, method: "POST" }),
  createReview: (body: CreateReviewPayload, options?: RequestOptions) =>
    apiFetch<Review>("/api/me/reviews", undefined, { ...options, body, method: "POST" }),
  getOrders: (query: PageQuery, options?: RequestOptions) => getPage<Order>("/api/me/orders", query, options),
  getPayments: (query: PageQuery, options?: RequestOptions) => getPage<Payment>("/api/me/payments", query, options),
  getReviews: (query: PageQuery, options?: RequestOptions) => getPage<Review>("/api/me/reviews", query, options),
  getWishlist: (options?: RequestOptions) => apiGet<Product[]>("/api/me/wishlist", undefined, options),
  removeWishlist: (productId: number, options?: RequestOptions) =>
    apiFetch<void>(`/api/me/wishlist/${productId}`, undefined, { ...options, method: "DELETE" }),
};
