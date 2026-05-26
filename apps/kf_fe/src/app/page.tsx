"use client";

import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApiResource } from "@/hooks/useApiResource";
import type { PageResult, Product } from "@/types/api";

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Seoul cropped blazer",
    brand: "Korea Fashion",
    origin: "Korea",
    price: 1290000,
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Minimal knit cardigan",
    brand: "KF Studio",
    origin: "Korea",
    price: 790000,
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Soft pleated skirt",
    brand: "Seoul Line",
    origin: "Korea",
    price: 620000,
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  const products = useApiResource<PageResult<Product>>({
    path: "/api/products",
    query: { page: 0, size: 6, sort: "id,desc" },
  });
  const featuredProducts = products.data?.content.length
    ? products.data.content
    : fallbackProducts;

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <StoreHeader />

      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,560px)_1fr] lg:px-8">
          <div>
            <Badge className="bg-white/15 text-white">Spring edit 2026</Badge>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Thoi trang Han Quoc cho moi ngay.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
              Mua sam cac item de phoi, form gon va chat lieu phu hop khi di hoc,
              di lam hoac xuong pho.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products">
                <Button className="bg-white text-slate-950 hover:bg-slate-100">
                  Xem san pham
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                  Gio hang
                </Button>
              </Link>
            </div>
          </div>
          <div
            className="min-h-[420px] rounded-lg bg-slate-800 shadow-2xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=85')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        <Value icon={<Truck className="h-5 w-5" />} title="Giao hang nhanh" text="Dong goi va ban giao trong 24h." />
        <Value icon={<RotateCcw className="h-5 w-5" />} title="Doi size linh hoat" text="Ho tro doi size cho san pham con tag." />
        <Value icon={<ShieldCheck className="h-5 w-5" />} title="Thanh toan an toan" text="Don hang duoc luu va theo doi qua API." />
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase text-slate-500">
                New arrivals
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                San pham moi
              </h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-slate-700">
              Xem tat ca
            </Link>
          </div>
          {products.error ? (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Chua lay duoc san pham tu API. Dang hien thi du lieu mau tren frontend.
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Value({
  icon,
  text,
  title,
}: {
  icon: ReactNode;
  text: string;
  title: string;
}) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
          {icon}
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="mt-1 text-sm text-slate-600">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
