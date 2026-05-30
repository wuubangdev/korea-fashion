import { apiFetch, apiGet, getPage, type RequestOptions } from "../client";
import type { ChangePasswordPayload, CreateReviewPayload, Order, PageQuery, Payment, Product, ReplyReviewPayload, Review, UpdateAvatarPayload, UpdateProfilePayload, User } from "@/types/api";

export const accountApi = {
  addWishlist: (productId: number, options?: RequestOptions) =>
    apiFetch<void>(`/api/me/wishlist/${productId}`, undefined, { ...options, method: "POST" }),
  changePassword: (body: ChangePasswordPayload, options?: RequestOptions) =>
    apiFetch<void>("/api/me/password", undefined, { ...options, body, method: "POST" }),
  createReview: (body: CreateReviewPayload, options?: RequestOptions) =>
    apiFetch<Review>("/api/me/reviews", undefined, { ...options, body, method: "POST" }),
  getOrder: (orderId: number, options?: RequestOptions) => apiGet<Order>(`/api/me/orders/${orderId}`, undefined, options),
  getOrders: (query: PageQuery, options?: RequestOptions) => getPage<Order>("/api/me/orders", query, options),
  getPaymentByOrder: (orderId: number, options?: RequestOptions) => apiGet<Payment>(`/api/me/payments/order/${orderId}`, undefined, options),
  getPayments: (query: PageQuery, options?: RequestOptions) => getPage<Payment>("/api/me/payments", query, options),
  getProfile: (options?: RequestOptions) => apiGet<User>("/api/me/profile", undefined, options),
  getReviews: (query: PageQuery, options?: RequestOptions) => getPage<Review>("/api/me/reviews", query, options),
  getWishlist: (options?: RequestOptions) => apiGet<Product[]>("/api/me/wishlist", undefined, options),
  removeWishlist: (productId: number, options?: RequestOptions) =>
    apiFetch<void>(`/api/me/wishlist/${productId}`, undefined, { ...options, method: "DELETE" }),
  replyReview: (reviewId: string, body: ReplyReviewPayload, options?: RequestOptions) =>
    apiFetch<Review>(`/api/me/reviews/${reviewId}/replies`, undefined, { ...options, body, method: "POST" }),
  updateAvatar: (body: UpdateAvatarPayload, options?: RequestOptions) =>
    apiFetch<User>("/api/me/avatar", undefined, { ...options, body, method: "POST" }),
  updateProfile: (body: UpdateProfilePayload, options?: RequestOptions) =>
    apiFetch<User>("/api/me/profile", undefined, { ...options, body, method: "POST" }),
};
