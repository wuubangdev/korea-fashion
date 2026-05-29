"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Home,
  ImageIcon,
  Menu,
  MessageSquareText,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  SlidersHorizontal,
  Settings,
  ShoppingBag,
  UsersRound,
  X,
} from "lucide-react";
import { adminResourceGroupLabels, adminResources } from "@/config/adminResources";
import { getAdminGroupLabel, getAdminResourceLabel } from "@/config/adminResourceDisplay";

const primaryNav = [
  { href: "/admin", icon: Home, label: "Tổng quan", meta: "Sức khỏe cửa hàng" },
  { href: "/admin/resources/orders", icon: ReceiptText, label: "Đơn hàng", meta: "Xử lý việc cần làm" },
  { href: "/admin/resources/products", icon: Package, label: "Sản phẩm", meta: "Giá, tồn kho, hình ảnh" },
  { href: "/admin/resources/categories", icon: ShoppingBag, label: "Danh mục", meta: "Nhóm hàng và menu" },
  { href: "/admin/resources/contact-messages", icon: MessageSquareText, label: "Liên hệ", meta: "Form và tin nhắn" },
  { href: "/admin/media", icon: ImageIcon, label: "Media", meta: "Ảnh, video, thư mục" },
  { href: "/admin/site-settings", icon: SlidersHorizontal, label: "Cấu hình website", meta: "SEO, logo, social" },
  { href: "/admin/resources/users", icon: UsersRound, label: "Khách hàng", meta: "Tài khoản và vai trò" },
];

const adminNavGroupOrder = ["Commerce", "Catalog", "Content", "Accounts", "System"] as const;

const adminNavResourceOrder: Record<string, string[]> = {
  Accounts: ["users", "members", "customer-addresses", "guest-customers", "admins"],
  Catalog: [
    "products",
    "variants",
    "categories",
    "brands",
    "product-images",
    "colors",
    "sizes",
    "product-collections",
    "product-options",
    "product-option-values",
    "product-attributes",
    "product-tags",
    "product-relations",
  ],
  Commerce: [
    "orders",
    "order-items",
    "payments",
    "payment-methods",
    "payment-transactions",
    "shipments",
    "shipment-events",
    "shipping-methods",
    "shippers",
    "carts",
    "cart-items",
    "coupons",
    "coupon-redemptions",
    "promotions",
    "return-requests",
    "return-items",
    "exchange-orders",
    "refunds",
    "inventory-transactions",
    "purchase-receipts",
    "purchase-receipt-items",
    "suppliers",
    "reviews",
    "review-images",
  ],
  Content: ["contact-messages", "banners", "menus", "menu-items", "pages", "blog-posts", "faqs", "store-policies"],
  System: ["audit-logs"],
};

function sortResourcesForNav(group: string) {
  const orderedSlugs = adminNavResourceOrder[group] ?? [];

  return adminResources
    .filter((resource) => resource.group === group)
    .sort((left, right) => {
      const leftIndex = orderedSlugs.indexOf(left.slug);
      const rightIndex = orderedSlugs.indexOf(right.slug);
      const safeLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
      const safeRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

      return safeLeftIndex - safeRightIndex || left.label.localeCompare(right.label);
    });
}

export function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-[#f6f7f4] text-slate-950 transition-[grid-template-columns] duration-300 lg:grid ${
        isSidebarCollapsed ? "lg:grid-cols-[76px_1fr]" : "lg:grid-cols-[272px_1fr]"
      }`}
    >
      {isMobileSidebarOpen ? (
        <button
          aria-label="Đóng sidebar"
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[272px] border-r border-stone-200 bg-[#fffdf8] shadow-2xl shadow-stone-950/15 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-auto lg:translate-x-0 lg:shadow-none ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`flex h-full flex-col px-4 py-5 transition-all ${isSidebarCollapsed ? "lg:px-3" : ""}`}>
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? "lg:justify-center" : "justify-between"}`}>
            <Link
              href="/admin"
              className={`min-w-0 ${isSidebarCollapsed ? "lg:hidden" : ""}`}
              aria-label="Korea Fashion admin"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <Image
                src="/korea-fashion-logo.svg"
                alt="Korea Fashion"
                width={165}
                height={36}
                priority
                className="h-9 w-auto"
              />
              <div className="mt-1 text-xs font-medium uppercase text-slate-500">
                Quản trị bán hàng
              </div>
            </Link>

            {isSidebarCollapsed ? (
              <Link href="/admin" className="hidden lg:grid h-10 w-10 place-items-center rounded-md bg-white shadow-sm" aria-label="Korea Fashion admin">
                <span className="text-sm font-semibold text-slate-950">KF</span>
              </Link>
            ) : null}

            <div className="flex items-center gap-2">
              {!isSidebarCollapsed ? (
                <Link
                  href="/"
                  className="hidden items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:-translate-y-0.5 hover:border-stone-300 hover:text-slate-950 hover:shadow-sm sm:inline-flex"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Shop
                </Link>
              ) : null}
              <button
                aria-label={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                className="hidden"
                type="button"
                onClick={() => setIsSidebarCollapsed((value) => !value)}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
              <button
                aria-label="Đóng sidebar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 bg-white text-slate-600 lg:hidden"
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className={`mt-6 grid grid-cols-2 gap-2 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-xs font-medium text-emerald-700">Hôm nay</div>
              <div className="mt-1 text-lg font-semibold text-emerald-950">24</div>
              <div className="text-xs text-emerald-700">đơn mới</div>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="text-xs font-medium text-amber-700">Cần xử lý</div>
              <div className="mt-1 text-lg font-semibold text-amber-950">8</div>
              <div className="text-xs text-amber-700">việc</div>
            </div>
          </div>

          <nav className="mt-6 overflow-y-auto pr-1">
            <div className={`px-2 text-xs font-semibold uppercase tracking-wide text-slate-400 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              Làm việc nhanh
            </div>
            <div className="mt-2 space-y-1.5">
              {primaryNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`group flex items-center rounded-md px-3 py-2.5 transition hover:-translate-y-0.5 hover:bg-stone-100 hover:shadow-sm ${
                      isSidebarCollapsed ? "lg:justify-center lg:px-0" : "gap-3"
                    }`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-emerald-700" />
                    <span className={`min-w-0 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                      <span className="block text-sm font-medium text-slate-900">{item.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{item.meta}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <details className={`group mt-5 rounded-md border border-stone-200 bg-white ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              <summary className="flex list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-slate-800">
                <span className="inline-flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-500" />
                  Tất cả chức năng
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-stone-200 px-2 py-2">
                {adminNavGroupOrder.map((group) => {
                  const resources = sortResourcesForNav(group);

                  return (
                    <details key={group} className="group/nested rounded-md">
                      <summary className="flex list-none items-center justify-between rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-stone-50">
                        {getAdminGroupLabel(group, adminResourceGroupLabels[group])}
                        <ChevronDown className="h-3.5 w-3.5 transition group-open/nested:rotate-180" />
                      </summary>
                      <div className="pb-2">
                        {resources.map((resource) => (
                          <Link
                            key={resource.slug}
                            href={`/admin/resources/${resource.slug}`}
                            className="block rounded-md px-3 py-2 text-sm text-slate-700 transition hover:translate-x-1 hover:bg-stone-50 hover:text-slate-950"
                            onClick={() => setIsMobileSidebarOpen(false)}
                          >
                            {getAdminResourceLabel(resource.slug, resource.label)}
                          </Link>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </details>
          </nav>

        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fffdf8]/90 backdrop-blur">
          <div className="flex min-h-16 items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <button
              aria-label="Mở sidebar"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-stone-300 hover:text-slate-950 hover:shadow-sm lg:hidden"
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              aria-label={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-stone-300 hover:text-slate-950 hover:shadow-sm lg:inline-flex"
              type="button"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-500">
                Bảng điều khiển quản trị
              </div>
              <div className="truncate text-lg font-semibold tracking-tight">
                Quản lý cửa hàng Korea Fashion
              </div>
            </div>
          </div>
        </header>
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
