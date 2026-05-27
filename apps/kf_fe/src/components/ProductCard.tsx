"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();

  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          <div
            className="aspect-[4/5] bg-stone-100 transition duration-300 group-hover:scale-[1.02]"
            style={{
              backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        </Link>
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-white text-stone-950 shadow-sm">Mới</Badge>
          {product.origin ? <Badge className="bg-rose-700 text-white">{product.origin}</Badge> : null}
        </div>
        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-stone-700 shadow-sm transition hover:bg-white hover:text-rose-700"
          aria-label="Yêu thích"
          type="button"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase text-stone-500">
            {product.brand || "Korea Fashion"}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="mt-1 line-clamp-1 block text-sm font-semibold text-stone-950"
          >
            {product.name}
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="font-semibold text-stone-950">
            {formatMoney(product.price)}
          </div>
          <Button size="sm" onClick={() => cart.add(product)}>
            <ShoppingBag className="h-4 w-4" />
            Thêm
          </Button>
        </div>
      </div>
    </article>
  );
}
