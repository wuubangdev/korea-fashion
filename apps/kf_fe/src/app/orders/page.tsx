"use client";

import { CreditCard, LogIn, Package, RefreshCw, ReceiptText, Truck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { formatDate, formatMoney } from "@/lib/format";
import type { Order, PageResult, Payment } from "@/types/api";

const emptyOrders: PageResult<Order> = { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
const emptyPayments: PageResult<Payment> = { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
const statusFilters = ["ALL", "NEW", "PENDING", "PROCESSING", "SHIPPING", "COMPLETED", "CANCELLED"];

export default function OrdersPage() {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [orders, setOrders] = useState(emptyOrders);
  const [payments, setPayments] = useState(emptyPayments);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null | undefined>(undefined);

  async function loadHistory(storedToken: string) {
    setIsLoading(true);
    setError(null);
    try {
      const [orderResult, paymentResult] = await Promise.all([
        accountApi.getOrders({ page: 0, size: 20, sort: "id,desc" }, { token: storedToken }),
        accountApi.getPayments({ page: 0, size: 20, sort: "paidAt,desc" }, { token: storedToken }),
      ]);
      setOrders(orderResult);
      setPayments(paymentResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể tải lịch sử đơn hàng.";
      setError(message);
      notify({ message, title: "Không tải được lịch sử", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      queueMicrotask(() => {
        setToken(null);
        setIsLoading(false);
      });
      return;
    }

    setToken(storedToken);
    void loadHistory(storedToken);
  }, []);

  const filteredOrders = useMemo(
    () =>
      statusFilter === "ALL"
        ? orders.content
        : orders.content.filter((order) => String(order.status ?? "").toUpperCase() === statusFilter),
    [orders.content, statusFilter],
  );
  const totalSpent = orders.content.reduce((sum, order) => sum + Number(order.grandTotal ?? order.total ?? 0), 0);
  const pendingOrders = orders.content.filter((order) => ["NEW", "PENDING", "PROCESSING", "SHIPPING"].includes(String(order.status ?? "").toUpperCase())).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <ReceiptText aria-hidden className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-normal">Don hang cua toi</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Theo doi don hang, trang thai giao hang va cac giao dich thanh toan gan voi tai khoan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/profile">Tai khoan</Link>
            </Button>
            {token ? (
              <Button variant="outline" onClick={() => void loadHistory(token)} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Tai lai
              </Button>
            ) : null}
          </div>
        </section>

        {token === undefined ? (
          <StateBox title="Dang tai du lieu" description="Dang kiem tra phien dang nhap cua ban." />
        ) : token === null ? (
          <StateBox
            icon={<LogIn className="h-5 w-5" />}
            title="Ban can dang nhap"
            description="Dang nhap de xem lich su mua hang va thanh toan cua rieng ban."
            actionHref="/login"
            actionLabel="Dang nhap"
          />
        ) : error ? (
          <StateBox title="Khong the tai du lieu" description={error} actionLabel="Thu lai" onAction={() => void loadHistory(token)} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Metric icon={Package} label="Tong don" value={String(orders.totalElements)} />
                <Metric icon={Truck} label="Dang xu ly" value={String(pendingOrders)} />
                <Metric icon={CreditCard} label="Tong chi tieu" value={formatMoney(totalSpent)} />
              </div>

              <Card className="overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-stone-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    <TabButton active={activeTab === "orders"} icon={<Package className="h-4 w-4" />} onClick={() => setActiveTab("orders")}>
                      Don hang ({orders.totalElements})
                    </TabButton>
                    <TabButton active={activeTab === "payments"} icon={<CreditCard className="h-4 w-4" />} onClick={() => setActiveTab("payments")}>
                      Thanh toan ({payments.totalElements})
                    </TabButton>
                  </div>
                  {activeTab === "orders" ? (
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                      {statusFilters.map((status) => (
                        <button
                          key={status}
                          className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition ${
                            statusFilter === status ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                          type="button"
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <CardContent className="p-4 sm:p-6">
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-32 animate-pulse rounded-md bg-stone-100" />
                      ))}
                    </div>
                  ) : activeTab === "orders" ? (
                    <OrderList orders={filteredOrders} />
                  ) : (
                    <PaymentList payments={payments.content} />
                  )}
                </CardContent>
              </Card>
            </section>

            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Huong dan trang thai</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-stone-600">
                  <StatusHint label="NEW" value="Shop da nhan don va dang kiem tra." />
                  <StatusHint label="PROCESSING" value="Shop dang chuan bi don." />
                  <StatusHint label="SHIPPING" value="Don dang tren duong giao." />
                  <StatusHint label="COMPLETED" value="Don da hoan tat." />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <Package className="h-8 w-8 text-stone-400" />
                  <h2 className="mt-3 font-semibold text-stone-950">Can ho tro don hang?</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Hay gui ma don hang cho shop qua trang lien he de duoc kiem tra nhanh.
                  </p>
                  <Button asChild className="mt-4 w-full" variant="outline">
                    <Link href="/contact">Lien he shop</Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
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
        title="Chua co don hang"
        description="Cac don hang da dat bang tai khoan nay se hien thi tai day."
        actionHref="/products"
        actionLabel="Mua sam ngay"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <article key={order.id} className="rounded-md border border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-stone-950">{order.orderCode || `#${order.id}`}</h2>
                <StatusBadge value={order.status} />
                <StatusBadge value={order.paymentStatus} />
                <StatusBadge value={order.shippingStatus} />
              </div>
              <div className="mt-2 grid gap-1 text-sm text-stone-600">
                <span>Ngay dat: {formatDate(order.orderDate)}</span>
                <span>Nguoi nhan: {order.customerName || "-"} {order.customerPhone ? `- ${order.customerPhone}` : ""}</span>
                {order.deliveryAddress ? <span>Giao den: {order.deliveryAddress}</span> : null}
              </div>
            </div>
            <div className="rounded-md bg-stone-50 px-4 py-3 text-left lg:text-right">
              <p className="text-xs font-semibold uppercase text-stone-500">Tong tien</p>
              <p className="mt-1 text-lg font-semibold text-stone-950">{formatMoney(order.grandTotal ?? order.total)}</p>
            </div>
          </div>

          {order.items?.length ? (
            <div className="mt-4 grid gap-2">
              {order.items.map((item) => (
                <div key={item.id ?? `${order.id}-${item.productId}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-md bg-stone-50 p-2 text-sm">
                  <SafeImage alt={item.productName || `San pham ${item.productId}`} className="h-14 rounded-md border border-stone-200" sizes="56px" src={item.productImageUrl} />
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-medium text-stone-950">{item.productName || `San pham #${item.productId}`}</p>
                    <p className="mt-1 text-xs text-stone-500">x{item.quantity}</p>
                  </div>
                  <span className="font-medium">{formatMoney(item.total ?? Number(item.unitPrice ?? 0) * item.quantity)}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-4 grid gap-2 border-t border-stone-100 pt-3 text-sm text-stone-600 sm:grid-cols-3">
            <SummaryLine label="Tam tinh" value={formatMoney(order.subtotal ?? 0)} />
            <SummaryLine label="Phi ship" value={formatMoney(order.shippingFee ?? 0)} />
            <SummaryLine label="Thanh toan" value={order.paymentMethodId || "-"} />
          </div>
          <div className="mt-4">
            <Button asChild size="sm" variant="outline">
              <Link href={`/payment-status/${order.id}`}>Theo doi thanh toan</Link>
            </Button>
          </div>
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
        title="Chua co thanh toan"
        description="Lich su thanh toan thanh cong hoac dang xu ly se hien thi tai day."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {payments.map((payment) => (
        <article key={payment.id} className="flex flex-col gap-3 rounded-md border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-stone-950">Thanh toan #{payment.id}</h2>
              <StatusBadge value={payment.status} />
            </div>
            <p className="mt-2 text-sm text-stone-600">Don hang #{payment.orderId || "-"}</p>
            <p className="mt-1 text-sm text-stone-600">Phuong thuc: {payment.method || "-"}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-stone-500">{formatDate(payment.paidAt)}</p>
            <p className="mt-1 text-lg font-semibold text-stone-950">{formatMoney(payment.amount)}</p>
            {payment.orderId ? (
              <Button asChild className="mt-2" size="sm" variant="outline">
                <Link href={`/payment-status/${payment.orderId}`}>Theo doi</Link>
              </Button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-stone-100 text-stone-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-stone-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-stone-950">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusHint({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
      <StatusBadge value={label} />
      <p className="mt-2 leading-6">{value}</p>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-stone-500">{label}</p>
      <p className="mt-1 font-medium text-stone-950">{value}</p>
    </div>
  );
}

function StateBox({
  actionHref,
  actionLabel,
  description,
  icon,
  onAction,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  icon?: ReactNode;
  onAction?: () => void;
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
        ) : onAction && actionLabel ? (
          <Button className="w-fit" onClick={onAction}>{actionLabel}</Button>
        ) : null}
      </div>
    </div>
  );
}
