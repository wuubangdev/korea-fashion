import { apiGet, type RequestOptions } from "../client";
import { crudEndpoint } from "../resource";
import type { Order, PageQuery, Product } from "@/types/api";

export type Admin = Record<string, unknown>;
export type AdminDashboardStats = {
  lowStockProducts: number;
  revenueTotal?: number | string;
  totalCategories: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
};
export type AuditLog = Record<string, unknown>;

export const adminsApi = crudEndpoint<Admin, Admin, Partial<Admin>>("/api/admins");
export const auditLogsApi = crudEndpoint<AuditLog>("/api/audit-logs");

export const adminDashboardApi = {
  lowStockProducts: (query: Partial<PageQuery> & { threshold?: number } = {}, options?: RequestOptions) =>
    apiGet<Product[]>("/api/admin/dashboard/low-stock-products", { size: 10, ...query }, options),
  recentOrders: (query: Partial<PageQuery> = {}, options?: RequestOptions) =>
    apiGet<Order[]>("/api/admin/dashboard/recent-orders", { size: 10, ...query }, options),
  stats: (options?: RequestOptions) =>
    apiGet<AdminDashboardStats>("/api/admin/dashboard/stats", undefined, options),
};
