import { apiFetch, apiGet, getPage, type RequestOptions } from "../client";
import type { Banner, Category, PageQuery, PageResult, Product, SiteSetting } from "@/types/api";

export type StorefrontHome = Record<string, unknown>;
export type StorefrontProductDetail = Record<string, unknown>;
export type StorefrontProductSummary = Record<string, unknown>;
export type StorefrontFilters = Record<string, unknown>;
export type StorefrontPolicy = Record<string, unknown>;
export type StorefrontPage = Record<string, unknown>;
export type StorefrontMenu = Record<string, unknown>;
export type StorefrontBlogPost = Record<string, unknown>;
export type StorefrontFaq = Record<string, unknown>;
export type StorefrontShippingMethod = Record<string, unknown>;
export type StorefrontPaymentMethod = Record<string, unknown>;
export type CouponValidationRequest = Record<string, unknown>;
export type CouponValidationResult = Record<string, unknown>;

export const storefrontApi = {
  banners: (options?: RequestOptions) =>
    apiGet<Banner[]>("/api/storefront/banners", undefined, options),
  blogPost: (slug: string, options?: RequestOptions) =>
    apiGet<StorefrontBlogPost>(`/api/storefront/blog-posts/${slug}`, undefined, options),
  blogPosts: (query: Partial<PageQuery> = {}, options?: RequestOptions) =>
    getPage<StorefrontBlogPost>("/api/storefront/blog-posts", { page: 0, size: 10, sort: "id,desc", ...query }, options),
  categories: (options?: RequestOptions) =>
    apiGet<Category[]>("/api/storefront/categories", undefined, options),
  faqs: (options?: RequestOptions) =>
    apiGet<StorefrontFaq[]>("/api/storefront/faqs", undefined, options),
  filters: (options?: RequestOptions) =>
    apiGet<StorefrontFilters>("/api/storefront/filters", undefined, options),
  home: (options?: RequestOptions) =>
    apiGet<StorefrontHome>("/api/storefront/home", undefined, options),
  menu: (code: string, options?: RequestOptions) =>
    apiGet<StorefrontMenu>(`/api/storefront/menus/${code}`, undefined, options),
  page: (slug: string, options?: RequestOptions) =>
    apiGet<StorefrontPage>(`/api/storefront/pages/${slug}`, undefined, options),
  pages: (options?: RequestOptions) =>
    apiGet<StorefrontPage[]>("/api/storefront/pages", undefined, options),
  paymentMethods: (options?: RequestOptions) =>
    apiGet<StorefrontPaymentMethod[]>("/api/storefront/payment-methods", undefined, options),
  policies: (options?: RequestOptions) =>
    apiGet<StorefrontPolicy[]>("/api/storefront/policies", undefined, options),
  policy: (slug: string, options?: RequestOptions) =>
    apiGet<StorefrontPolicy>(`/api/storefront/policies/${slug}`, undefined, options),
  product: (slugOrId: string | number, options?: RequestOptions) =>
    apiGet<StorefrontProductDetail>(`/api/storefront/products/${slugOrId}`, undefined, options),
  productRelated: (slugOrId: string | number, options?: RequestOptions) =>
    apiGet<Product[]>(`/api/storefront/products/${slugOrId}/related`, undefined, options),
  products: (query: Partial<PageQuery> & Record<string, unknown> = {}, options?: RequestOptions) =>
    apiGet<PageResult<StorefrontProductSummary>>("/api/storefront/products", { page: 0, size: 12, sort: "id,desc", ...query }, options),
  searchSuggestions: (query: { q?: string; keyword?: string; limit?: number } = {}, options?: RequestOptions) =>
    apiGet<string[]>("/api/storefront/search/suggestions", query, options),
  shippingMethods: (options?: RequestOptions) =>
    apiGet<StorefrontShippingMethod[]>("/api/storefront/shipping-methods", undefined, options),
  siteSettings: (options?: RequestOptions) =>
    apiGet<SiteSetting>("/api/storefront/site-settings", undefined, options),
  validateCoupon: (body: CouponValidationRequest, options?: RequestOptions) =>
    apiFetch<CouponValidationResult>("/api/storefront/coupons/validate", undefined, { ...options, body, method: "POST" }),
};
