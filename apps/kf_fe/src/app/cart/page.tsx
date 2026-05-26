"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const cart = useCart();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <StoreHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Gio hang</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.items.length === 0 ? (
              <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Gio hang dang trong.
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-[96px_1fr_auto]"
                  >
                    <div
                      className="h-24 rounded-md bg-slate-100"
                      style={{
                        backgroundImage: item.product.imageUrl
                          ? `url('${item.product.imageUrl}')`
                          : undefined,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    />
                    <div>
                      <div className="font-semibold">{item.product.name}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {formatMoney(item.product.price)}
                      </div>
                      <Input
                        className="mt-3 w-24"
                        min={1}
                        onChange={(event) =>
                          cart.updateQuantity(item.product.id, Number(event.target.value))
                        }
                        type="number"
                        value={item.quantity}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => cart.remove(item.product.id)}
                      aria-label="Xoa san pham"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Tong don</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>San pham</span>
              <span>{cart.count}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-lg font-semibold">
              <span>Tong tien</span>
              <span>{formatMoney(cart.total)}</span>
            </div>
            <Link href="/checkout">
              <Button className="mt-5 w-full" disabled={cart.items.length === 0}>
                Dat hang
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
