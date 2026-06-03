"use client";

import { Heart, LogIn, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ProductRating } from "@/components/ProductRating";
import { SafeImage } from "@/components/SafeImage";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { useLoginRedirectHref } from "@/lib/authRedirect";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

export default function WishlistPage() {
  const loginHref = useLoginRedirectHref("/wishlist");
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      queueMicrotask(() => {
        setToken(null);
        setIsLoading(false);
      });
      return;
    }

    queueMicrotask(() => setToken(storedToken));

    accountApi.getWishlist({ token: storedToken })
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Không thể tải danh sách yêu thích."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (productId: number) => {
    if (!token) {
      return;
    }

    await accountApi.removeWishlist(productId, { token });
    setItems((current) => current.filter((item) => item.id !== productId));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-rose-50 text-rose-700">
              <Heart aria-hidden className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-normal">Danh sách yêu thích</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Các sản phẩm bạn đã lưu sẽ được đồng bộ theo tài khoản đăng nhập.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">
              <ShoppingBag aria-hidden className="h-4 w-4" />
              Xem sản phẩm
            </Link>
          </Button>
        </section>

        {token === undefined ? (
          <StateBox title="Đang tải dữ liệu" description="Đang kiểm tra phiên đăng nhập của bạn." />
        ) : token === null ? (
          <StateBox
            icon={<LogIn className="h-5 w-5" />}
            title="Bạn cần đăng nhập"
            description="Đăng nhập để xem và quản lý danh sách sản phẩm yêu thích của riêng bạn."
            actionHref={loginHref}
            actionLabel="Đăng nhập"
          />
        ) : error ? (
          <StateBox title="Không thể tải dữ liệu" description={error} />
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg border border-stone-200 bg-white" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                <Link href={`/products/${product.id}`} className="block">
                  <SafeImage
                    alt={product.name}
                    className="aspect-[4/5]"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    src={product.imageUrl}
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase text-stone-500">{product.brand || "Korea Fashion"}</p>
                  <Link href={`/products/${product.id}`} className="mt-1 line-clamp-1 block font-semibold text-stone-950">
                    {product.name}
                  </Link>
                  <div className="mt-2">
                    <ProductRating rating={product.ratingAverage} count={product.reviewCount} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-semibold">{formatMoney(product.price)}</span>
                    <Button variant="outline" size="sm" onClick={() => handleRemove(product.id)}>
                      <Trash2 className="h-4 w-4" />
                      Bỏ lưu
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <StateBox
            icon={<Heart className="h-5 w-5" />}
            title="Chưa có sản phẩm yêu thích"
            description="Bấm biểu tượng trái tim trên sản phẩm để lưu lại và xem nhanh tại đây."
            actionHref="/products"
            actionLabel="Khám phá sản phẩm"
          />
        )}
      </main>
      <StoreFooter />
    </div>
  );
}

function StateBox({
  actionHref,
  actionLabel,
  description,
  icon,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-8">
      <div className="flex max-w-xl flex-col gap-4">
        {icon ? <div className="flex h-11 w-11 items-center justify-center rounded-md bg-stone-100 text-stone-700">{icon}</div> : null}
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        </div>
        {actionHref && actionLabel ? (
          <Button asChild className="w-fit">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
