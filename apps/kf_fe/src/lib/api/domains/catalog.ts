import { apiFetch, apiGet, getPage, type RequestOptions } from "../client";
import { crudEndpoint, deleteAction, postAction } from "../resource";
import type { Category, PageQuery, PageResult, Product, ProductPayload } from "@/types/api";

export type Variant = Record<string, unknown>;
export type ProductAttribute = Record<string, unknown>;
export type ProductCollection = Record<string, unknown>;
export type ProductImage = Record<string, unknown>;
export type ProductOption = Record<string, unknown>;
export type ProductOptionValue = Record<string, unknown>;
export type ProductRelation = Record<string, unknown>;
export type ProductTag = Record<string, unknown>;
export type Brand = Record<string, unknown>;
export type Color = Record<string, unknown>;
export type Size = Record<string, unknown>;

export const productsApi = {
  ...crudEndpoint<Product, ProductPayload, Partial<ProductPayload>>("/api/products"),
  bulkDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/products/bulk", ids, options),
  bulkHardDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/products/hard/bulk", ids, options),
  copy: (id: number, options?: RequestOptions) =>
    postAction<Product>(`/api/products/${id}/copy`, undefined, options),
  list: (query: Partial<PageQuery> & Record<string, unknown> = {}, options?: RequestOptions) =>
    apiGet<PageResult<Product>>("/api/products", { page: 0, size: 24, sort: "id,desc", ...query }, options),
};

export const categoriesApi = {
  ...crudEndpoint<Category, Omit<Category, "id">, Partial<Omit<Category, "id">>>("/api/categories"),
  bulkDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/categories/bulk", ids, options),
  bulkHardDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/categories/hard/bulk", ids, options),
  copy: (id: number, options?: RequestOptions) =>
    postAction<Category>(`/api/categories/${id}/copy`, undefined, options),
};

export const variantsApi = {
  ...crudEndpoint<Variant>("/api/variants"),
  bulkDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/variants/bulk", ids, options),
  bulkHardDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/variants/hard/bulk", ids, options),
  copy: (id: number, options?: RequestOptions) =>
    postAction<Variant>(`/api/variants/${id}/copy`, undefined, options),
  listByProduct: (productId: number, query: Partial<PageQuery> = {}, options?: RequestOptions) =>
    getPage<Variant>(`/api/variants/product/${productId}`, { page: 0, size: 10, sort: "id,desc", ...query }, options),
};

export const productAttributesApi = crudEndpoint<ProductAttribute>("/api/product-attributes");
export const productCollectionsApi = crudEndpoint<ProductCollection, ProductCollection, Partial<ProductCollection>>("/api/product-collections");
export const productImagesApi = crudEndpoint<ProductImage>("/api/product-images");
export const productOptionsApi = crudEndpoint<ProductOption>("/api/product-options");
export const productOptionValuesApi = crudEndpoint<ProductOptionValue>("/api/product-option-values");
export const productRelationsApi = crudEndpoint<ProductRelation>("/api/product-relations");
export const productTagsApi = crudEndpoint<ProductTag, ProductTag, Partial<ProductTag>>("/api/product-tags");
export const brandsApi = crudEndpoint<Brand, Brand, Partial<Brand>>("/api/brands");
export const colorsApi = crudEndpoint<Color, Color, Partial<Color>>("/api/colors");
export const sizesApi = crudEndpoint<Size, Size, Partial<Size>>("/api/sizes");

export function getProducts(query?: Record<string, unknown>) {
  return productsApi.list(query ?? {});
}

export function getProduct(id: string | number) {
  return apiFetch<Product>(`/api/products/${id}`);
}

export function getCategories() {
  return getPage<Category>("/api/categories", { page: 0, size: 50, sort: "id,desc" });
}

export function createProduct(payload: ProductPayload) {
  return productsApi.create(payload);
}

export function createCategory(payload: Omit<Category, "id">) {
  return categoriesApi.create(payload);
}
