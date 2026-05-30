"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, CreditCard, PackageCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import type { Order, Payment } from "@/types/api";

type UserOrderBellProps = {
  token: string | null;
};

type Snapshot = Record<string, string>;

const userSnapshotKey = "kf_user_order_payment_statuses";
const terminalStatuses = new Set(["COMPLETED", "DELIVERED", "PAID", "FAILED", "CANCELLED", "RETURNED", "REFUNDED"]);

export function UserOrderBell({ token }: UserOrderBellProps) {
  const { notify } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setOrders([]);
      setPayments([]);
      return;
    }

    let stopped = false;

    async function load() {
      const activeToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
      if (!activeToken) {
        return;
      }

      try {
        const [orderResult, paymentResult] = await Promise.all([
          accountApi.getOrders({ page: 0, size: 8, sort: "id,desc" }, { token: activeToken }),
          accountApi.getPayments({ page: 0, size: 8, sort: "updatedAt,desc" }, { token: activeToken }),
        ]);
        if (stopped) {
          return;
        }

        setOrders(orderResult.content ?? []);
        setPayments(paymentResult.content ?? []);
        notifyChanges(orderResult.content ?? [], paymentResult.content ?? []);
      } catch {
        // Header notifications should stay silent if the session expires.
      }
    }

    function notifyChanges(nextOrders: Order[], nextPayments: Payment[]) {
      const previous = readSnapshot();
      const nextSnapshot: Snapshot = {};

      nextOrders.forEach((order) => {
        const key = `order:${order.id}`;
        const value = [order.status, order.paymentStatus, order.shippingStatus].filter(Boolean).join("|");
        nextSnapshot[key] = value;
        if (previous[key] && previous[key] !== value) {
          notify({
            message: `Don ${order.orderCode || `#${order.id}`} da cap nhat trang thai.`,
            title: "Trang thai don hang thay doi",
            type: "info",
          });
        }
      });

      nextPayments.forEach((payment) => {
        const key = `payment:${payment.id}`;
        const value = String(payment.status || "");
        nextSnapshot[key] = value;
        if (previous[key] && previous[key] !== value) {
          notify({
            message: `Thanh toan don #${payment.orderId ?? payment.id} dang la ${value || "N/A"}.`,
            title: "Trang thai thanh toan thay doi",
            type: value === "PAID" ? "success" : value === "FAILED" || value === "CANCELLED" ? "error" : "info",
          });
        }
      });

      window.localStorage.setItem(userSnapshotKey, JSON.stringify(nextSnapshot));
    }

    load();
    const intervalId = window.setInterval(load, 12000);
    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, [notify, token]);

  const activeCount = useMemo(
    () =>
      orders.filter((order) => {
        const values = [order.status, order.paymentStatus, order.shippingStatus].map((value) => String(value || "").toUpperCase());
        return values.some((value) => value && !terminalStatuses.has(value));
      }).length,
    [orders],
  );

  if (!token) {
    return null;
  }

  return (
    <div className="relative">
      <Button aria-label="Theo doi don hang" size="icon" variant="ghost" onClick={() => setOpen((value) => !value)}>
        <Bell className="h-4 w-4" />
      </Button>
      {activeCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold leading-none text-white">
          {activeCount > 99 ? "99+" : activeCount}
        </span>
      ) : null}
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(380px,calc(100vw-2rem))] rounded-md border border-stone-200 bg-white p-2 shadow-2xl shadow-stone-950/15">
          <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-2 py-2">
            <div className="text-sm font-semibold text-stone-950">Theo doi don hang</div>
            <Link className="text-xs font-semibold text-emerald-700 hover:text-emerald-800" href="/orders">
              Xem tat ca
            </Link>
          </div>
          {orders.length ? (
            <div className="max-h-96 overflow-y-auto py-1">
              {orders.map((order) => {
                const payment = payments.find((item) => item.orderId === order.id);
                return (
                  <Link key={order.id} className="block rounded-md p-2 hover:bg-stone-50" href={`/payment-status/${order.id}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-stone-950">
                        <PackageCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                        <span className="truncate">{order.orderCode || `#${order.id}`}</span>
                      </span>
                      <StatusBadge value={order.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusBadge value={order.paymentStatus || payment?.status} />
                      <StatusBadge value={order.shippingStatus} />
                    </div>
                    {payment ? (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                        <CreditCard className="h-3.5 w-3.5" />
                        Thanh toan: {payment.status || "N/A"}
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="px-2 py-5 text-sm text-stone-500">Chua co don hang de theo doi.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function readSnapshot(): Snapshot {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(userSnapshotKey) || "{}");
    return parsed && typeof parsed === "object" ? parsed as Snapshot : {};
  } catch {
    return {};
  }
}
