"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Link href={`/products/${product.id}`} className="block">
        <div
          className="aspect-[4/5] bg-slate-100"
          style={{
            backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${product.id}`}
              className="line-clamp-1 text-sm font-semibold text-slate-950"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-slate-500">{product.brand || "Korea Fashion"}</p>
          </div>
          {product.origin ? <Badge>{product.origin}</Badge> : null}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="font-semibold text-slate-950">
            {formatMoney(product.price)}
          </div>
          <Button size="sm" variant="outline" onClick={() => cart.add(product)}>
            <ShoppingBag className="h-4 w-4" />
            Them
          </Button>
        </div>
      </div>
    </article>
  );
}
