"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductRating } from "@/components/ProductRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const router = useRouter();
  const [isWishlistSaved, setIsWishlistSaved] = useState(false);
  const [isWishlistSaving, setIsWishlistSaving] = useState(false);
  const price = Number(product.price ?? 0);
  const compareAtPrice = Number(product.compareAtPrice ?? 0);
  const discountPercent =
    compareAtPrice > price && price > 0
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const handleWishlist = async () => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      router.push("/login");
      return;
    }

    setIsWishlistSaving(true);
    try {
      await accountApi.addWishlist(product.id, { token });
      setIsWishlistSaved(true);
    } finally {
      setIsWishlistSaving(false);
    }
  };

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
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="bg-white text-stone-950 shadow-sm">Mới</Badge>
          {discountPercent > 0 ? <Badge className="bg-rose-700 text-white">-{discountPercent}%</Badge> : null}
          {product.origin ? <Badge className="bg-stone-900 text-white">{product.origin}</Badge> : null}
        </div>
        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-stone-700 shadow-sm transition hover:bg-white hover:text-rose-700 disabled:opacity-60"
          aria-label="Thêm vào yêu thích"
          disabled={isWishlistSaving}
          onClick={handleWishlist}
          type="button"
        >
          <Heart aria-hidden className={`h-4 w-4 ${isWishlistSaved ? "fill-rose-600 text-rose-600" : ""}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase text-stone-500">{product.brand || "Korea Fashion"}</p>
          <Link href={`/products/${product.id}`} className="mt-1 line-clamp-1 block text-sm font-semibold text-stone-950">
            {product.name}
          </Link>
        </div>
        <div className="mt-2">
          <ProductRating rating={product.ratingAverage} count={product.reviewCount} />
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold text-stone-950">{formatMoney(product.price)}</div>
            {discountPercent > 0 ? (
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="text-stone-400 line-through">{formatMoney(compareAtPrice)}</span>
                <span className="font-medium text-rose-700">Tiết kiệm {formatMoney(compareAtPrice - price)}</span>
              </div>
            ) : null}
          </div>
          <Button size="sm" onClick={() => cart.add(product)}>
            <ShoppingBag aria-hidden className="h-4 w-4" />
            Thêm
          </Button>
        </div>
      </div>
    </article>
  );
}
