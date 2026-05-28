"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreFooter } from "@/components/StoreFooter";
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

const collections = [
  {
    title: "Office minimal",
    text: "Blazer, sơ mi và chân váy gọn form cho ngày đi làm.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Campus casual",
    text: "Áo knit, cardigan và denim dễ phối cho đi học.",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Weekend look",
    text: "Set mềm, váy xếp ly và phụ kiện nhẹ cho cuối tuần.",
    image:
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
    <main className="min-h-screen bg-white text-stone-950">
      <StoreHeader />

      <section className="border-b border-stone-200 bg-stone-950 text-white">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,540px)_1fr] lg:px-8">
          <div className="pb-4 lg:pb-0">
            <Badge className="bg-white/15 text-white">Spring edit 2026</Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Korea Fashion
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
              Thời trang Hàn Quốc tối giản, dễ phối và phù hợp cho lịch trình
              hằng ngày: đi học, đi làm, cà phê hoặc dạo phố.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products">
                <Button className="bg-white text-slate-950 hover:bg-slate-100">
                  Xem sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                  Giỏ hàng
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-3 text-sm">
              <Metric value="120+" label="mẫu mới" />
              <Metric value="24h" label="xử lý đơn" />
              <Metric value="7 ngày" label="đổi size" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_0.72fr]">
            <div
              className="min-h-[440px] rounded-lg bg-stone-800 shadow-2xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=85')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="grid gap-4">
              <div
                className="min-h-[210px] rounded-lg bg-stone-800"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <Sparkles className="h-5 w-5 text-rose-200" />
                <div className="mt-3 text-sm font-semibold">Gợi ý hôm nay</div>
                <p className="mt-1 text-sm leading-6 text-white/70">
                  Cardigan mỏng, chân váy xếp ly và túi mini cho outfit nhẹ nhàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        <Value icon={<Truck className="h-5 w-5" />} title="Giao hàng nhanh" text="Đóng gói và bàn giao trong 24h." />
        <Value icon={<RotateCcw className="h-5 w-5" />} title="Đổi size linh hoạt" text="Hỗ trợ đổi size cho sản phẩm còn tag." />
        <Value icon={<ShieldCheck className="h-5 w-5" />} title="Thanh toán an toàn" text="Đơn hàng được lưu và theo dõi qua hệ thống." />
      </section>

      <section className="border-y border-stone-200 bg-stone-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase text-rose-700">
                Collections
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                Bộ sưu tập nổi bật
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.title}
                href="/products"
                className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
              >
                <div
                  className="aspect-[4/3] bg-stone-100 transition duration-300 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage: `url('${collection.image}')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="p-4">
                  <div className="font-semibold text-stone-950">{collection.title}</div>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{collection.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase text-rose-700">
                New arrivals
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                Sản phẩm mới
              </h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-stone-700 hover:text-stone-950">
              Xem tất cả
            </Link>
          </div>
          {products.error ? (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Chưa lấy được sản phẩm từ API. Đang hiển thị dữ liệu mẫu trên frontend.
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose-700 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/75">
              <BadgeCheck className="h-4 w-4" />
              Korea Fashion membership
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Nhận ưu đãi cho đơn hàng đầu tiên</h2>
          </div>
          <Link href="/register">
            <Button className="bg-white text-rose-700 hover:bg-rose-50">
              Tạo tài khoản
            </Button>
          </Link>
        </div>
      </section>

      <StoreFooter />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
      <div className="text-lg font-semibold">{value}</div>
      <div className="mt-1 text-xs text-white/65">{label}</div>
    </div>
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-700 text-white">
          {icon}
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="mt-1 text-sm text-stone-600">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
