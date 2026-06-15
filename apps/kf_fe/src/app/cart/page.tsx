"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import {
  calculateOrderTotal,
  calculateShippingFee,
} from "@/lib/orderTotals";

export default function CartPage() {
  const cart = useCart();
  const shippingFee = calculateShippingFee({
    itemCount: cart.items.length,
    subtotal: cart.total,
  });
  const grandTotal = calculateOrderTotal({ shippingFee, subtotal: cart.total });

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Shopping bag</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Giỏ hàng</h1>
          <p className="mt-2 text-sm text-stone-600">
            Kiểm tra sản phẩm, số lượng và tổng tiền trước khi đặt hàng.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm đã chọn</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.items.length === 0 ? (
              <div className="grid min-h-[320px] place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
                <div>
                  <ShoppingBag className="mx-auto h-10 w-10 text-stone-400" />
                  <h2 className="mt-4 text-lg font-semibold">Giỏ hàng đang trống</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                    Chọn vài sản phẩm yêu thích để bắt đầu tạo đơn hàng.
                  </p>
                  <Link href="/products">
                    <Button className="mt-5">Tiếp tục mua sắm</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid gap-4 rounded-md border border-stone-200 bg-white p-4 sm:grid-cols-[112px_1fr_auto]"
                  >
                    <SafeImage
                      alt={item.product.name}
                      className="h-28 rounded-md"
                      sizes="112px"
                      src={item.product.imageUrl}
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-semibold hover:text-rose-700"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 text-sm text-stone-500">
                        {formatMoney(item.product.price)}
                      </div>
                      <div className="mt-3 flex h-10 w-32 items-center justify-between rounded-md border border-stone-300 bg-white">
                        <button
                          className="flex h-10 w-10 items-center justify-center text-stone-600 hover:text-stone-950"
                          type="button"
                          aria-label="Giảm số lượng"
                          onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                        <button
                          className="flex h-10 w-10 items-center justify-center text-stone-600 hover:text-stone-950"
                          type="button"
                          aria-label="Tăng số lượng"
                          onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-4 sm:block sm:text-right">
                      <div className="font-semibold">
                        {formatMoney(Number(item.product.price ?? 0) * item.quantity)}
                      </div>
                      <Button
                        className="mt-0 sm:mt-3"
                        variant="ghost"
                        size="icon"
                        onClick={() => cart.remove(item.product.id)}
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Sản phẩm</span>
              <span>{cart.count}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Tạm tính</span>
              <span>{formatMoney(cart.total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatMoney(shippingFee)}</span>
            </div>
            <div className="border-t border-stone-200 pt-3">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span>{formatMoney(grandTotal)}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Miễn phí vận chuyển cho đơn hàng từ 1.000.000 VND.
              </p>
            </div>
            <div className="grid gap-3 pt-2">
              <Link href="/checkout" className="block">
                <Button className="w-full" disabled={cart.items.length === 0}>
                  Đặt hàng
                </Button>
              </Link>
              <Link href="/products" className="block">
                <Button className="w-full" variant="outline">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <StoreFooter />
    </main>
  );
}
