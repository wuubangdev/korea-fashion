import { apiFetch } from "@/lib/api";
import type {
  Category,
  CreateOrderPayload,
  Order,
  PageResult,
  Product,
  ProductPayload,
} from "@/types/api";

export function getProducts(query?: Record<string, unknown>) {
  return apiFetch<PageResult<Product>>("/api/products", {
    page: 0,
    size: 24,
    sort: "id,desc",
    ...query,
  });
}

export function getProduct(id: string | number) {
  return apiFetch<Product>(`/api/products/${id}`);
}

export function getCategories() {
  return apiFetch<PageResult<Category>>("/api/categories", {
    page: 0,
    size: 50,
    sort: "id,desc",
  });
}

export function createProduct(payload: ProductPayload) {
  return apiFetch<Product>("/api/products", undefined, {
    body: payload,
    method: "POST",
  });
}

export function createCategory(payload: Omit<Category, "id">) {
  return apiFetch<Category>("/api/categories", undefined, {
    body: payload,
    method: "POST",
  });
}

export function createOrder(payload: CreateOrderPayload) {
  return apiFetch<Order>("/api/orders", undefined, {
    body: payload,
    method: "POST",
  });
}
