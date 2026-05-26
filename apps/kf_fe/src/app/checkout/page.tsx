"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import type { CreateOrderPayload, Order } from "@/types/api";

export default function CheckoutPage() {
  const cart = useCart();
  const order = useApiMutation<Order, CreateOrderPayload>();
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await order.mutate({
        path: "/api/orders",
        body: {
          deliveryAddress: address,
          note: note || undefined,
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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <StoreHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Dat hang</CardTitle>
            <CardDescription>
              Don hang se duoc tao bang API /api/orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {createdOrderId ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Tao don hang thanh cong. Ma don: #{createdOrderId}
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-700">
                  Dia chi giao hang
                  <Input
                    className="mt-1"
                    onChange={(event) => setAddress(event.target.value)}
                    required
                    value={address}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Ghi chu
                  <Input
                    className="mt-1"
                    onChange={(event) => setNote(event.target.value)}
                    value={note}
                  />
                </label>
                {order.error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {order.error}
                  </div>
                ) : null}
                <Button disabled={cart.items.length === 0 || order.isLoading} type="submit">
                  {order.isLoading ? "Dang tao don..." : "Xac nhan dat hang"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Tom tat</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.items.length === 0 ? (
              <div className="text-sm text-slate-600">
                Gio hang trong.{" "}
                <Link href="/products" className="font-medium text-slate-950">
                  Chon san pham
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-slate-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatMoney(Number(item.product.price ?? 0) * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-3 text-lg font-semibold">
                  {formatMoney(cart.total)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
