"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, CreditCard, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import type { Order, Payment } from "@/types/api";

type PaymentViewState = "success" | "failed" | "pending";

const successStatuses = new Set(["PAID", "SUCCESS", "COMPLETED"]);
const failedStatuses = new Set(["FAILED", "CANCELLED", "REFUNDED"]);

export default function PaymentStatusPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = Number(params.orderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = useCallback(async () => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setError("Ban can dang nhap de theo doi thanh toan.");
      setLoading(false);
      return;
    }

    try {
      const [orderResult, paymentResult] = await Promise.allSettled([
        accountApi.getOrder(orderId, { token }),
        accountApi.getPaymentByOrder(orderId, { token }),
      ]);
      if (orderResult.status === "fulfilled") {
        setOrder(orderResult.value);
      } else {
        throw orderResult.reason;
      }
      if (paymentResult.status === "fulfilled") {
        setPayment(paymentResult.value);
      }
      setError("");
      setLastCheckedAt(new Date());
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Khong the lay trang thai thanh toan.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      setError("Ma don hang khong hop le.");
      setLoading(false);
      return;
    }

    loadStatus();
    const intervalId = window.setInterval(loadStatus, 5000);
    return () => window.clearInterval(intervalId);
  }, [loadStatus, orderId]);

  const paymentState = useMemo<PaymentViewState>(() => {
    const values = [payment?.status, order?.paymentStatus, order?.status].map((value) => String(value || "").toUpperCase());
    if (values.some((value) => successStatuses.has(value))) {
      return "success";
    }
    if (values.some((value) => failedStatuses.has(value))) {
      return "failed";
    }
    return "pending";
  }, [order, payment]);

  const header = getPaymentHeader(paymentState);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Payment tracking</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Theo doi thanh toan</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Trang nay tu dong kiem tra moi 5 giay. Admin co the gia lap thanh cong hoac that bai bang cach sua status payment trong trang quan tri.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <Card className={header.cardClass}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                {header.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-semibold tracking-normal">{header.title}</h2>
                <p className="mt-2 text-sm leading-6">{header.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="button" onClick={loadStatus} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Kiem tra ngay
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/orders">Xem don hang</Link>
                  </Button>
                </div>
                {lastCheckedAt ? (
                  <p className="mt-3 text-xs text-stone-500">Lan kiem tra gan nhat: {lastCheckedAt.toLocaleTimeString("vi-VN")}</p>
                ) : null}
                {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5" />
                Trang thai
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <StatusLine label="Don hang" value={order?.status} />
              <StatusLine label="Thanh toan don" value={order?.paymentStatus || payment?.status} />
              <StatusLine label="Giao hang" value={order?.shippingStatus} />
              <StatusLine label="Payment record" value={payment?.status} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5 text-sm text-stone-600">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-stone-950">{order?.orderCode || `#${orderId}`}</p>
                  <p className="mt-1">Tong tien: {formatMoney(Number(payment?.amount ?? order?.grandTotal ?? order?.total ?? 0))}</p>
                  <p className="mt-1">Phuong thuc: {payment?.method || order?.paymentMethodId || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      <StoreFooter />
    </main>
  );
}

function StatusLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-stone-500">{label}</span>
      <StatusBadge value={value} />
    </div>
  );
}

function getPaymentHeader(state: PaymentViewState) {
  if (state === "success") {
    return {
      cardClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
      description: "Thanh toan da duoc xac nhan. Don hang se tiep tuc duoc xu ly va giao theo trang thai admin cap nhat.",
      icon: <CheckCircle2 className="h-8 w-8 text-emerald-700" />,
      title: "Thanh toan thanh cong",
    };
  }

  if (state === "failed") {
    return {
      cardClass: "border-rose-200 bg-rose-50 text-rose-950",
      description: "Thanh toan khong thanh cong hoac da bi huy. Ban co the lien he shop de duoc ho tro xu ly lai.",
      icon: <XCircle className="h-8 w-8 text-rose-700" />,
      title: "Thanh toan that bai",
    };
  }

  return {
    cardClass: "border-amber-200 bg-amber-50 text-amber-950",
    description: "Thanh toan dang cho xac nhan. Trang se tu dong cap nhat khi admin doi status payment.",
    icon: <Clock3 className="h-8 w-8 text-amber-700" />,
    title: "Dang cho thanh toan",
  };
}
