"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Bell, CreditCard, ReceiptText } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { getPage, ordersApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import type { Order, Payment } from "@/types/api";

type AdminNotificationState = {
  orders: Order[];
  payments: Payment[];
};

const adminSeenKey = "kf_admin_seen_notifications";
const activeOrderStatuses = new Set(["NEW", "PENDING"]);
const activePaymentStatuses = new Set(["PENDING", "UNPAID"]);

export function AdminNotificationBell() {
  const { notify } = useToast();
  const [state, setState] = useState<AdminNotificationState>({ orders: [], payments: [] });
  const [open, setOpen] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    let stopped = false;

    async function load() {
      const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        return;
      }

      try {
        const [orderResult, paymentResult] = await Promise.all([
          ordersApi.list({ page: 0, size: 8, sort: "id,desc" }, { token }),
          getPage<Payment>("/api/payments", { page: 0, size: 8, sort: "updatedAt,desc" }, { token }),
        ]);
        if (stopped) {
          return;
        }

        const orders = orderResult.content ?? [];
        const payments = paymentResult.content ?? [];
        setState({ orders, payments });
        announceNewItems(orders, payments);
      } catch {
        // Notification polling must not block admin pages.
      }
    }

    function announceNewItems(orders: Order[], payments: Payment[]) {
      const previous = readSeen();
      const currentOrderIds = orders.map((order) => String(order.id));
      const currentPaymentIds = payments.map((payment) => String(payment.id));

      if (initializedRef.current) {
        const newOrders = currentOrderIds.filter((id) => !previous.orders.includes(id));
        const newPayments = currentPaymentIds.filter((id) => !previous.payments.includes(id));
        if (newOrders.length || newPayments.length) {
          notify({
            message: `${newOrders.length} don moi, ${newPayments.length} thanh toan moi.`,
            title: "Admin co cap nhat moi",
            type: "info",
          });
        }
      }

      initializedRef.current = true;
      window.localStorage.setItem(adminSeenKey, JSON.stringify({ orders: currentOrderIds, payments: currentPaymentIds }));
    }

    load();
    const intervalId = window.setInterval(load, 15000);
    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, [notify]);

  const pendingOrderCount = state.orders.filter((order) => activeOrderStatuses.has(String(order.status || "").toUpperCase())).length;
  const pendingPaymentCount = state.payments.filter((payment) => activePaymentStatuses.has(String(payment.status || "").toUpperCase())).length;
  const badgeCount = pendingOrderCount + pendingPaymentCount;

  return (
    <div className="relative">
      <Button aria-label="Thong bao admin" size="icon" variant="outline" onClick={() => setOpen((value) => !value)}>
        <Bell className="h-4 w-4" />
      </Button>
      {badgeCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold leading-none text-white">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      ) : null}
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(380px,calc(100vw-2rem))] rounded-md border border-stone-200 bg-white p-2 shadow-2xl shadow-stone-950/15">
          <NotificationSection
            emptyText="Chua co don moi."
            href="/admin/resources/orders"
            icon={<ReceiptText className="h-4 w-4 text-emerald-700" />}
            title={`Don can xu ly (${pendingOrderCount})`}
          >
            {state.orders.slice(0, 5).map((order) => (
              <Link key={order.id} className="block rounded-md p-2 hover:bg-stone-50" href="/admin/resources/orders">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-stone-950">{order.orderCode || `#${order.id}`}</span>
                  <StatusBadge value={order.status} />
                </div>
                <div className="mt-1 truncate text-xs text-stone-500">{order.customerName || order.customerPhone || "Khach hang"}</div>
              </Link>
            ))}
          </NotificationSection>
          <NotificationSection
            emptyText="Chua co thanh toan moi."
            href="/admin/resources/payments"
            icon={<CreditCard className="h-4 w-4 text-emerald-700" />}
            title={`Thanh toan (${pendingPaymentCount})`}
          >
            {state.payments.slice(0, 5).map((payment) => (
              <Link key={payment.id} className="block rounded-md p-2 hover:bg-stone-50" href="/admin/resources/payments">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-stone-950">#{payment.orderId ?? payment.id}</span>
                  <StatusBadge value={payment.status} />
                </div>
                <div className="mt-1 text-xs text-stone-500">{payment.method || "PAYMENT"} - {formatMoney(Number(payment.amount ?? 0))}</div>
              </Link>
            ))}
          </NotificationSection>
        </div>
      ) : null}
    </div>
  );
}

function NotificationSection({
  children,
  emptyText,
  href,
  icon,
  title,
}: {
  children: ReactNode;
  emptyText: string;
  href: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section className="border-b border-stone-100 py-2 last:border-b-0">
      <div className="mb-1 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
          {icon}
          {title}
        </div>
        <Link className="text-xs font-semibold text-emerald-700 hover:text-emerald-800" href={href}>
          Xem
        </Link>
      </div>
      {Array.isArray(children) && children.length === 0 ? <div className="px-2 py-3 text-sm text-stone-500">{emptyText}</div> : children}
    </section>
  );
}

function readSeen() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(adminSeenKey) || "{}") as { orders?: string[]; payments?: string[] };
    return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
    };
  } catch {
    return { orders: [], payments: [] };
  }
}
