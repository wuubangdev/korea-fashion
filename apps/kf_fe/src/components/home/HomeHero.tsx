"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function HomeHero() {
  const { settings } = useSiteSettings();

  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-stone-950 text-white">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(244,114,182,0.28),transparent_34%),linear-gradient(90deg,rgba(12,10,9,0.96),rgba(12,10,9,0.78)_44%,rgba(12,10,9,0.42))]" />

      <div className="page-enter relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,540px)_1fr] lg:px-8">
        <div className="pb-4 lg:pb-0">
          <Badge className="bg-white/15 text-white ring-1 ring-white/20">Bộ sưu tập 2026</Badge>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            {settings.siteName}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
            {settings.siteDescription ||
              "Thời trang Hàn Quốc tối giản, dễ phối và phù hợp cho lịch trình hằng ngày: đi học, đi làm, cà phê hoặc dạo phố."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="group">
              <Button className="bg-white text-slate-950 shadow-lg shadow-white/10 hover:bg-slate-100 hover:shadow-white/20">
                Xem sản phẩm
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
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

        <div className="relative grid gap-4 sm:grid-cols-[1fr_0.72fr]">
          <div className="pointer-events-none absolute -right-4 top-10 hidden h-28 w-28 rounded-full border border-white/10 bg-white/5 blur-[1px] lg:block" />
          <div className="soft-shine h-[440px] overflow-hidden rounded-lg bg-stone-800 shadow-2xl shadow-black/40 ring-1 ring-white/10 transition duration-500 hover:shadow-black/55">
            <div
              className="hero-slide-vertical w-full"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=85')",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div className="grid gap-4">
            <div className="soft-shine min-h-[210px] overflow-hidden rounded-lg bg-stone-800 shadow-xl shadow-black/25 ring-1 ring-white/10 transition duration-500 hover:shadow-black/40">
              <div className="flex h-full min-h-[210px] w-full">
                <div
                  className="hero-slide-horizontal h-full min-h-[210px] shrink-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, transparent 0 48%, rgba(12,10,9,0.18) 50%, transparent 52%), url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85'), url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85')",
                  }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/20 backdrop-blur transition duration-500 hover:border-white/20 hover:bg-white/15">
              <div className="text-sm font-semibold">Gợi ý hôm nay</div>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Cardigan mỏng, chân váy xếp ly và túi mini cho outfit nhẹ nhàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-3 shadow-lg shadow-black/10 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/15 hover:shadow-black/20">
      <div className="text-lg font-semibold">{value}</div>
      <div className="mt-1 text-xs text-white/65">{label}</div>
    </div>
  );
}
