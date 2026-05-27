"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard, MapPin, Phone, UserRound } from "lucide-react";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import type { CreateOrderPayload, Order } from "@/types/api";

export default function CheckoutPage() {
  const cart = useCart();
  const order = useApiMutation<Order, CreateOrderPayload>();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const shippingFee = cart.total >= 1000000 || cart.items.length === 0 ? 0 : 30000;
  const grandTotal = cart.total + shippingFee;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const checkoutNote = [
        `Khách hàng: ${customerName}`,
        `Số điện thoại: ${phone}`,
        `Thanh toán: ${paymentMethod}`,
        note ? `Ghi chú: ${note}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const result = await order.mutate({
        path: "/api/orders",
        body: {
          deliveryAddress: address,
          note: checkoutNote || undefined,
          items: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: Number(item.product.price ?? 0),
          })),
        },
      });

      setCreatedOrderId(result.id);
      cart.clear();
    } catch {
      // Error state is handled by useApiMutation.
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Thanh toán</h1>
          <p className="mt-2 text-sm text-stone-600">
            Điền thông tin giao hàng và kiểm tra lại đơn trước khi xác nhận.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhận hàng</CardTitle>
            <CardDescription>
              Đơn hàng sẽ được tạo qua API `/api/orders`.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {createdOrderId ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
                <CheckCircle2 className="h-10 w-10" />
                <h2 className="mt-4 text-lg font-semibold">Đặt hàng thành công</h2>
                <p className="mt-2 text-sm leading-6">
                  Mã đơn hàng của bạn là #{createdOrderId}. Shop sẽ kiểm tra và liên hệ
                  xác nhận thông tin giao hàng.
                </p>
                <Link href="/products">
                  <Button className="mt-5">Tiếp tục mua sắm</Button>
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-stone-700">
                  Họ tên người nhận
                  <div className="relative mt-1">
                    <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      className="pl-9"
                      onChange={(event) => setCustomerName(event.target.value)}
                      required
                      value={customerName}
                    />
                  </div>
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  Số điện thoại
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      className="pl-9"
                      inputMode="tel"
                      minLength={9}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                      value={phone}
                    />
                  </div>
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  Địa chỉ giao hàng
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      className="pl-9"
                      onChange={(event) => setAddress(event.target.value)}
                      required
                      value={address}
                    />
                  </div>
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  Phương thức thanh toán
                  <div className="relative mt-1">
                    <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <Select
                      className="pl-9"
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      value={paymentMethod}
                    >
                      <option value="COD">Thanh toán khi nhận hàng</option>
                      <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                      <option value="STORE_WALLET">Ví cửa hàng</option>
                    </Select>
                  </div>
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  Ghi chú
                  <Input
                    className="mt-1"
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Ví dụ: giao sau 18h"
                    value={note}
                  />
                </label>
                {order.error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {order.error}
                  </div>
                ) : null}
                <Button className="w-full" disabled={cart.items.length === 0 || order.isLoading} type="submit">
                  {order.isLoading ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Tóm tắt</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.items.length === 0 ? (
              <div className="text-sm text-stone-600">
                Giỏ hàng trống.{" "}
                <Link href="/products" className="font-medium text-stone-950">
                  Chọn sản phẩm
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-stone-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatMoney(Number(item.product.price ?? 0) * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-stone-200 pt-3">
                  <div className="flex justify-between gap-3 text-sm text-stone-600">
                    <span>Tạm tính</span>
                    <span>{formatMoney(cart.total)}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-3 text-sm text-stone-600">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee === 0 ? "Miễn phí" : formatMoney(shippingFee)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-3 text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span>{formatMoney(grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <StoreFooter />
    </main>
  );
}
