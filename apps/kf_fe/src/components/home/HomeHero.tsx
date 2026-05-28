"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function HomeHero() {
  const { settings } = useSiteSettings();

  return (
    <section className="border-b border-stone-200 bg-stone-950 text-white">
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,540px)_1fr] lg:px-8">
        <div className="pb-4 lg:pb-0">
          <Badge className="bg-white/15 text-white">Bộ sưu tập 2026</Badge>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            {settings.siteName}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
            {settings.siteDescription ||
              "Thời trang Hàn Quốc tối giản, dễ phối và phù hợp cho lịch trình hằng ngày: đi học, đi làm, cà phê hoặc dạo phố."}
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
