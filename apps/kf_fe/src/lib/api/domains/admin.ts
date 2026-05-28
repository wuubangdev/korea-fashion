import { apiGet, type RequestOptions } from "../client";
import { crudEndpoint } from "../resource";
import type { Order, PageQuery, PageResult, Product } from "@/types/api";

export type Admin = Record<string, unknown>;
export type AdminDashboardStats = Record<string, unknown>;
export type AuditLog = Record<string, unknown>;

export const adminsApi = crudEndpoint<Admin, Admin, Partial<Admin>>("/api/admins");
export const auditLogsApi = crudEndpoint<AuditLog>("/api/audit-logs");

export const adminDashboardApi = {
  lowStockProducts: (query: Partial<PageQuery> & { threshold?: number } = {}, options?: RequestOptions) =>
    apiGet<PageResult<Product>>("/api/admin/dashboard/low-stock-products", { page: 0, size: 10, sort: "id,desc", ...query }, options),
  recentOrders: (query: Partial<PageQuery> = {}, options?: RequestOptions) =>
    apiGet<PageResult<Order>>("/api/admin/dashboard/recent-orders", { page: 0, size: 10, sort: "id,desc", ...query }, options),
  stats: (options?: RequestOptions) =>
    apiGet<AdminDashboardStats>("/api/admin/dashboard/stats", undefined, options),
};
