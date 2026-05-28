import { apiFetch, getPage, type RequestOptions } from "../client";
import { crudEndpoint, deleteAction, postAction, putAction } from "../resource";
import type { CreateOrderPayload, Order, PageQuery, PageResult } from "@/types/api";

export type AssignShipperPayload = {
  shipperId: string;
};

export type UpdateShippingStatusPayload = {
  shippingStatus: string;
};

export type OrderItemResource = Record<string, unknown>;

export const ordersApi = {
  ...crudEndpoint<Order, CreateOrderPayload, Partial<Order>>("/api/orders"),
  assignShipper: (id: number, body: AssignShipperPayload, options?: RequestOptions) =>
    putAction<Order, AssignShipperPayload>(`/api/orders/${id}/shipper`, body, options),
  bulkDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/orders/bulk", ids, options),
  bulkHardDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/orders/hard/bulk", ids, options),
  copy: (id: number, options?: RequestOptions) =>
    postAction<Order>(`/api/orders/${id}/copy`, undefined, options),
  listByShipper: (shipperId: string, query: Partial<PageQuery> = {}, options?: RequestOptions) =>
    getPage<Order>(`/api/orders/shipper/${shipperId}`, { page: 0, size: 10, sort: "id,desc", ...query }, options),
  updateShippingStatus: (id: number, body: UpdateShippingStatusPayload, options?: RequestOptions) =>
    putAction<Order, UpdateShippingStatusPayload>(`/api/orders/${id}/shipping-status`, body, options),
  updateStatus: (id: number, status: string, options?: RequestOptions) =>
    apiFetch<Order>(`/api/orders/${id}/status`, { status }, { ...options, method: "PUT" }),
};

export const orderItemsApi = crudEndpoint<OrderItemResource>("/api/order-items");

export function createOrder(payload: CreateOrderPayload) {
  return ordersApi.create(payload);
}

export function getOrders(query: Partial<PageQuery> = {}, options?: RequestOptions): Promise<PageResult<Order>> {
  return ordersApi.list(query, options);
}
