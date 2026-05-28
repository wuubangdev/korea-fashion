import { apiGet, type RequestOptions } from "../client";
import { crudEndpoint } from "../resource";
import type { Banner, PageResult, SiteSetting } from "@/types/api";

export type BlogPost = Record<string, unknown>;
export type Faq = Record<string, unknown>;
export type Menu = Record<string, unknown>;
export type MenuItem = Record<string, unknown>;
export type Page = Record<string, unknown>;
export type StorePolicy = Record<string, unknown>;

export const bannersApi = crudEndpoint<Banner, Banner, Partial<Banner>>("/api/banners");
export const blogPostsApi = crudEndpoint<BlogPost, BlogPost, Partial<BlogPost>>("/api/blog-posts");
export const faqsApi = crudEndpoint<Faq>("/api/faqs");
export const menusApi = crudEndpoint<Menu, Menu, Partial<Menu>>("/api/menus");
export const menuItemsApi = crudEndpoint<MenuItem>("/api/menu-items");
export const pagesApi = crudEndpoint<Page, Page, Partial<Page>>("/api/pages");
export const siteSettingsApi = {
  ...crudEndpoint<SiteSetting, SiteSetting, Partial<SiteSetting>>("/api/site-settings"),
  current: (options?: RequestOptions) => apiGet<SiteSetting>("/api/site-settings/current", undefined, options),
};
export const storePoliciesApi = crudEndpoint<StorePolicy, StorePolicy, Partial<StorePolicy>>("/api/store-policies");

export function getBanners(options?: RequestOptions): Promise<PageResult<Banner>> {
  return bannersApi.list({ page: 0, size: 50, sort: "id,desc" }, options);
}
