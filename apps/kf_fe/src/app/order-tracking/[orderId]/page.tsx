"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, CreditCard, MapPin, Package, RefreshCw, Truck, XCircle } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { StatusBadge } from "@/components/StatusBadge";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { formatDate, formatMoney } from "@/lib/format";
import type { Order } from "@/types/api";

type TrackingStep = {
  date?: string;
  description: string;
  key: string;
  label: string;
};

const paidStatuses = new Set(["PAID", "SUCCESS", "COMPLETED"]);
const cancelledStatuses = new Set(["CANCELLED", "FAILED", "REFUNDED", "RETURNED"]);

export default function OrderTrackingPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = Number(params.orderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setError("Ban can dang nhap de theo doi don hang.");
      setLoading(false);
      return;
    }

    try {
      const result = await accountApi.getOrder(orderId, { token });
      setOrder(result);
      setError("");
      setLastCheckedAt(new Date());
    } catch (trackingError) {
      setError(trackingError instanceof Error ? trackingError.message : "Khong the tai trang thai don hang.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      queueMicrotask(() => {
        setError("Ma don hang khong hop le.");
        setLoading(false);
      });
      return;
    }

    queueMicrotask(() => void loadOrder());
    const intervalId = window.setInterval(loadOrder, 7000);
    return () => window.clearInterval(intervalId);
  }, [loadOrder, orderId]);

  const tracking = useMemo(() => buildTracking(order), [order]);
  const activeStep = useMemo(() => getActiveStep(order), [order]);
  const isPaid = paidStatuses.has(String(order?.paymentStatus || "").toUpperCase());
  const isCancelled = cancelledStatuses.has(String(order?.status || order?.shippingStatus || "").toUpperCase());

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase text-rose-700">Order tracking</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Theo doi don hang</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Cap nhat trang thai xu ly, dong goi va giao hang cua don da thanh toan thanh cong.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={loadOrder} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Tai lai
            </Button>
            <Button asChild variant="outline">
              <Link href="/orders">Lich su don hang</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <section className="space-y-6">
          <Card className={isCancelled ? "border-rose-200 bg-rose-50" : isPaid ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                  {isCancelled ? (
                    <XCircle className="h-8 w-8 text-rose-700" />
                  ) : isPaid ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-700" />
                  ) : (
                    <Clock3 className="h-8 w-8 text-amber-700" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-normal">{order?.orderCode || `#${orderId}`}</h2>
                    <StatusBadge value={order?.status} />
                    <StatusBadge value={order?.paymentStatus} />
                    <StatusBadge value={order?.shippingStatus} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {isCancelled
                      ? "Don hang da bi huy hoac hoan tra. Vui long lien he shop neu can kiem tra them."
                      : isPaid
                        ? "Thanh toan da thanh cong. Shop se cap nhat tung buoc xu ly va giao hang tai day."
                        : "Don hang chua co trang thai thanh toan thanh cong. Hay quay lai trang thanh toan de kiem tra."}
                  </p>
                  {lastCheckedAt ? (
                    <p className="mt-3 text-xs text-stone-500">Lan cap nhat gan nhat: {lastCheckedAt.toLocaleTimeString("vi-VN")}</p>
                  ) : null}
                  {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5" />
                Hanh trinh don hang
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {loading && !order ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-16 animate-pulse rounded-md bg-stone-100" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {tracking.map((step, index) => {
                    const state = getStepState(index, activeStep, isCancelled);
                    return <TimelineItem key={step.key} step={step} state={state} />;
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                San pham trong don
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {order?.items?.length ? (
                <div className="grid gap-3">
                  {order.items.map((item) => (
                    <div key={item.id ?? `${order.id}-${item.productId}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-md border border-stone-200 bg-white p-3 text-sm">
                      <SafeImage alt={item.productName || `San pham ${item.productId}`} className="h-16 rounded-md border border-stone-200" sizes="64px" src={item.productImageUrl} />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-semibold text-stone-950">{item.productName || `San pham #${item.productId}`}</p>
                        <p className="mt-1 text-xs text-stone-500">So luong: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">{formatMoney(item.total ?? Number(item.unitPrice ?? item.price ?? 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-600">Chua co du lieu san pham cho don hang nay.</p>
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5" />
                Dia chi nhan hang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 text-sm text-stone-600">
              <InfoLine label="Nguoi nhan" value={order?.customerName} />
              <InfoLine label="Dien thoai" value={order?.customerPhone} />
              <InfoLine label="Dia chi" value={order?.deliveryAddress} />
              <InfoLine label="Ngay dat" value={formatDate(order?.orderDate)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5" />
                Thanh toan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 text-sm text-stone-600">
              <InfoLine label="Phuong thuc" value={order?.paymentMethodId} />
              <InfoLine label="Tam tinh" value={formatMoney(order?.subtotal ?? 0)} />
              <InfoLine label="Phi ship" value={formatMoney(order?.shippingFee ?? 0)} />
              <InfoLine label="Tong cong" strong value={formatMoney(order?.grandTotal ?? order?.total ?? 0)} />
              <Button asChild className="mt-2 w-full" variant="outline">
                <Link href={`/payment-status/${orderId}`}>Xem thanh toan</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <StoreFooter />
    </main>
  );
}

function buildTracking(order: Order | null): TrackingStep[] {
  return [
    { date: order?.orderDate, description: "Don hang da duoc tao tren he thong.", key: "created", label: "Da dat hang" },
    { date: order?.confirmedAt, description: "Shop da xac nhan thong tin va ton kho.", key: "confirmed", label: "Shop xac nhan" },
    { date: order?.packedAt, description: "Don hang duoc chuan bi va dong goi.", key: "packed", label: "Dang dong goi" },
    { date: order?.assignedAt, description: "Don hang duoc ban giao cho don vi phu trach giao.", key: "assigned", label: "Ban giao van chuyen" },
    { date: order?.shippedAt, description: "Don hang dang tren duong giao den ban.", key: "shipping", label: "Dang giao hang" },
    { date: order?.deliveredAt, description: "Don hang da giao thanh cong.", key: "delivered", label: "Da giao hang" },
  ];
}

function getActiveStep(order: Order | null) {
  if (!order) {
    return -1;
  }

  const shippingStatus = String(order.shippingStatus || "").toUpperCase();
  const orderStatus = String(order.status || "").toUpperCase();
  if (order.deliveredAt || shippingStatus === "DELIVERED" || orderStatus === "COMPLETED") {
    return 5;
  }
  if (order.shippedAt || ["SHIPPING", "SHIPPED", "IN_TRANSIT"].includes(shippingStatus) || orderStatus === "SHIPPING") {
    return 4;
  }
  if (order.assignedAt || order.shipperId) {
    return 3;
  }
  if (order.packedAt || ["PACKED", "READY_TO_SHIP"].includes(String(order.fulfillmentStatus || "").toUpperCase())) {
    return 2;
  }
  if (order.confirmedAt || ["CONFIRMED", "PROCESSING"].includes(orderStatus)) {
    return 1;
  }
  return 0;
}

function getStepState(index: number, activeStep: number, cancelled: boolean) {
  if (cancelled && index > activeStep) {
    return "cancelled";
  }
  if (index < activeStep) {
    return "done";
  }
  if (index === activeStep) {
    return "active";
  }
  return "upcoming";
}

function TimelineItem({ state, step }: { state: string; step: TrackingStep }) {
  const done = state === "done";
  const active = state === "active";
  const cancelled = state === "cancelled";

  return (
    <div className="grid grid-cols-[32px_1fr] gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`grid h-8 w-8 place-items-center rounded-full border ${
            done || active
              ? "border-emerald-600 bg-emerald-600 text-white"
              : cancelled
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-stone-200 bg-stone-100 text-stone-400"
          }`}
        >
          {done ? <CheckCircle2 className="h-4 w-4" /> : active ? <Clock3 className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
        </div>
        <div className={`min-h-10 w-px ${done || active ? "bg-emerald-200" : "bg-stone-200"}`} />
      </div>
      <div className="pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className={`font-semibold ${done || active ? "text-stone-950" : "text-stone-500"}`}>{step.label}</h3>
          <span className="text-xs text-stone-500">{formatDate(step.date)}</span>
        </div>
        <p className="mt-1 text-sm leading-6 text-stone-600">{step.description}</p>
      </div>
    </div>
  );
}

function InfoLine({ label, strong, value }: { label: string; strong?: boolean; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-stone-500">{label}</span>
      <span className={`text-right ${strong ? "font-semibold text-stone-950" : "text-stone-700"}`}>{value || "-"}</span>
    </div>
  );
}
