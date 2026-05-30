"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductRating } from "@/components/ProductRating";
import { SafeImage } from "@/components/SafeImage";
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
  const productPath = `/products/${product.slug || product.id}`;

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
    <article className="card-enter hover-lift group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm shadow-stone-950/5">
      <div className="relative">
        <Link href={productPath} className="block overflow-hidden bg-stone-100">
          <SafeImage
            alt={product.name}
            className="soft-shine aspect-[4/5] transition duration-700 ease-out group-hover:scale-[1.045]"
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
            src={product.imageUrl}
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="bg-white text-stone-950 shadow-sm">Mới</Badge>
          {discountPercent > 0 ? <Badge className="bg-rose-700 text-white">-{discountPercent}%</Badge> : null}
          {product.origin ? <Badge className="bg-stone-900 text-white">{product.origin}</Badge> : null}
        </div>
        <button
          className="icon-hover absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-md bg-white/95 text-stone-700 shadow-sm backdrop-blur hover:bg-white hover:text-rose-700 disabled:opacity-60"
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
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-stone-500">{product.brand || "Korea Fashion"}</p>
          <Link href={productPath} className="mt-1 line-clamp-2 min-h-10 block text-sm font-semibold leading-5 text-stone-950 transition hover:text-emerald-800">
            {product.name}
          </Link>
        </div>
        <div className="mt-2">
          <ProductRating rating={product.ratingAverage} count={product.reviewCount} />
        </div>
        <div className="mt-4 border-t border-stone-100 pt-4">
          <div className="min-w-0">
            <div className="text-base font-semibold text-stone-950">{formatMoney(product.price)}</div>
            {discountPercent > 0 ? (
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="text-stone-400 line-through">{formatMoney(compareAtPrice)}</span>
                <span className="font-medium text-rose-700">Tiết kiệm {formatMoney(compareAtPrice - price)}</span>
              </div>
            ) : (
              <p className="mt-1 text-xs text-stone-500">Sẵn sàng giao hàng</p>
            )}
          </div>
          <Button className="mt-4 w-full transition hover:-translate-y-0.5" size="sm" onClick={() => cart.add(product)}>
            <ShoppingBag aria-hidden className="h-4 w-4" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </article>
  );
}
