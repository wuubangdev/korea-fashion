"use client";

import { CreditCard, LogIn, Package, ReceiptText } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { formatDate, formatMoney } from "@/lib/format";
import type { Order, PageResult, Payment } from "@/types/api";

const emptyOrders: PageResult<Order> = { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
const emptyPayments: PageResult<Payment> = { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
  const [orders, setOrders] = useState(emptyOrders);
  const [payments, setPayments] = useState(emptyPayments);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      queueMicrotask(() => {
        setToken(null);
        setIsLoading(false);
      });
      return;
    }

    queueMicrotask(() => setToken(storedToken));

    Promise.all([
      accountApi.getOrders({ page: 0, size: 10, sort: "id,desc" }, { token: storedToken }),
      accountApi.getPayments({ page: 0, size: 10, sort: "paidAt,desc" }, { token: storedToken }),
    ])
      .then(([orderResult, paymentResult]) => {
        setOrders(orderResult);
        setPayments(paymentResult);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Không thể tải lịch sử tài khoản."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <ReceiptText aria-hidden className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-normal">Lịch sử mua hàng</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Theo dõi các đơn hàng và giao dịch thanh toán gắn với tài khoản đăng nhập.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/profile">Tài khoản của tôi</Link>
          </Button>
        </section>

        {token === undefined ? (
          <StateBox title="Đang tải dữ liệu" description="Đang kiểm tra phiên đăng nhập của bạn." />
        ) : token === null ? (
          <StateBox
            icon={<LogIn className="h-5 w-5" />}
            title="Bạn cần đăng nhập"
            description="Đăng nhập để xem lịch sử mua hàng và thanh toán của riêng bạn."
            actionHref="/login"
            actionLabel="Đăng nhập"
          />
        ) : error ? (
          <StateBox title="Không thể tải dữ liệu" description={error} />
        ) : (
          <section className="rounded-lg border border-stone-200 bg-white">
            <div className="flex border-b border-stone-200 p-2">
              <TabButton active={activeTab === "orders"} icon={<Package className="h-4 w-4" />} onClick={() => setActiveTab("orders")}>
                Đơn hàng ({orders.totalElements})
              </TabButton>
              <TabButton active={activeTab === "payments"} icon={<CreditCard className="h-4 w-4" />} onClick={() => setActiveTab("payments")}>
                Thanh toán ({payments.totalElements})
              </TabButton>
            </div>

            <div className="p-4 sm:p-6">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-md bg-stone-100" />
                  ))}
                </div>
              ) : activeTab === "orders" ? (
                <OrderList orders={orders.content} />
              ) : (
                <PaymentList payments={payments.content} />
              )}
            </div>
          </section>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}

function TabButton({
  active,
  children,
  icon,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
        active ? "bg-stone-950 text-white" : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {children}
    </button>
  );
}

function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <StateBox
        icon={<Package className="h-5 w-5" />}
        title="Chưa có đơn hàng"
        description="Các đơn hàng đã đặt bằng tài khoản này sẽ hiển thị tại đây."
        actionHref="/products"
        actionLabel="Mua sắm ngay"
      />
    );
  }

  return (
    <div className="divide-y divide-stone-200">
      {orders.map((order) => (
        <article key={order.id} className="py-5 first:pt-0 last:pb-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-stone-950">Đơn #{order.orderCode || order.id}</h2>
                <StatusBadge value={order.status} />
                <StatusBadge value={order.paymentStatus} />
              </div>
              <p className="mt-2 text-sm text-stone-600">Ngày đặt: {formatDate(order.orderDate)}</p>
              {order.deliveryAddress ? <p className="mt-1 text-sm text-stone-600">Giao đến: {order.deliveryAddress}</p> : null}
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-stone-500">Tổng tiền</p>
              <p className="mt-1 text-lg font-semibold text-stone-950">{formatMoney(order.grandTotal ?? order.total)}</p>
            </div>
          </div>
          {order.items?.length ? (
            <div className="mt-4 grid gap-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-md bg-stone-50 px-3 py-2 text-sm">
                  <span>Sản phẩm #{item.productId} x {item.quantity}</span>
                  <span className="font-medium">{formatMoney(item.total)}</span>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function PaymentList({ payments }: { payments: Payment[] }) {
  if (!payments.length) {
    return (
      <StateBox
        icon={<CreditCard className="h-5 w-5" />}
        title="Chưa có thanh toán"
        description="Lịch sử thanh toán thành công hoặc đang xử lý sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <div className="divide-y divide-stone-200">
      {payments.map((payment) => (
        <article key={payment.id} className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-stone-950">Thanh toán #{payment.id}</h2>
              <StatusBadge value={payment.status} />
            </div>
            <p className="mt-2 text-sm text-stone-600">Đơn hàng #{payment.orderId || "-"}</p>
            <p className="mt-1 text-sm text-stone-600">Phương thức: {payment.method || "-"}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-stone-500">{formatDate(payment.paidAt)}</p>
            <p className="mt-1 text-lg font-semibold text-stone-950">{formatMoney(payment.amount)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function StateBox({
  actionHref,
  actionLabel,
  description,
  icon,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-8">
      <div className="flex max-w-xl flex-col gap-4">
        {icon ? <div className="flex h-11 w-11 items-center justify-center rounded-md bg-stone-100 text-stone-700">{icon}</div> : null}
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        </div>
        {actionHref && actionLabel ? (
          <Button asChild className="w-fit">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
