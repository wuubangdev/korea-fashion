"use client";

import { ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";
import { StoreHeader } from "@/components/StoreHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiResource } from "@/hooks/useApiResource";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const cart = useCart();
  const product = useApiResource<Product>({
    path: `/api/products/${params.id}`,
  });
  const currentProduct = product.data;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <StoreHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {product.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {product.error}
          </div>
        ) : null}

        {currentProduct ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div
              className="min-h-[560px] rounded-lg border border-slate-200 bg-slate-100"
              style={{
                backgroundImage: currentProduct.imageUrl
                  ? `url('${currentProduct.imageUrl}')`
                  : undefined,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase text-slate-500">
                      {currentProduct.brand || "Korea Fashion"}
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-normal">
                      {currentProduct.name}
                    </h1>
                  </div>
                  {currentProduct.origin ? <Badge>{currentProduct.origin}</Badge> : null}
                </div>
                <div className="mt-6 text-2xl font-semibold">
                  {formatMoney(currentProduct.price)}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {currentProduct.description ||
                    "San pham phong cach Han Quoc, de phoi trong nhieu outfit hang ngay."}
                </p>
                <div className="mt-6 grid gap-3 text-sm text-slate-600">
                  <div className="rounded-md bg-slate-50 p-3">
                    Chat lieu mem, phu hop mac hang ngay.
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    Ho tro doi size neu san pham con tag.
                  </div>
                </div>
                <Button className="mt-6 w-full" size="lg" onClick={() => cart.add(currentProduct)}>
                  <ShoppingBag className="h-4 w-4" />
                  Them vao gio
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-[560px] animate-pulse rounded-lg bg-slate-200" />
        )}
      </div>
    </main>
  );
}
