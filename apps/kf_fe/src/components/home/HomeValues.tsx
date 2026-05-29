"use client";

import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

const values = [
  {
    accent: "bg-rose-50 text-rose-800 ring-rose-200",
    code: "01",
    icon: Truck,
    text: "Đóng gói và bàn giao đơn trong 24h.",
    title: "Giao hàng nhanh",
  },
  {
    accent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    code: "02",
    icon: RotateCcw,
    text: "Hỗ trợ đổi size cho sản phẩm còn tag.",
    title: "Đổi size linh hoạt",
  },
  {
    accent: "bg-slate-100 text-slate-900 ring-slate-200",
    code: "03",
    icon: ShieldCheck,
    text: "Đơn hàng được lưu và theo dõi qua hệ thống.",
    title: "Thanh toán an toàn",
  },
];

export function HomeValues() {
  return (
    <section className="border-b border-stone-200 bg-[#fbfaf7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="cursor-default select-none overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl shadow-stone-950/5">
          <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
            <div className="relative overflow-hidden border-b border-stone-200 bg-[linear-gradient(135deg,#0f172a_0%,#881337_48%,#065f46_100%)] p-6 text-white lg:border-b-0 lg:border-r">
              <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.65)_1px,transparent_0)] [background-size:12px_12px]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_42%,rgba(0,0,0,0.16))]" />
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/45">Service promise</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">Mua sắm nhẹ hơn từ lúc chọn đến lúc nhận hàng.</h2>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  Korea Fashion tối ưu các bước quan trọng để đơn hàng rõ ràng, nhanh và dễ kiểm soát.
                </p>
              </div>
            </div>

            <div className="grid divide-y divide-stone-200 md:grid-cols-3 md:divide-x md:divide-y-0">
              {values.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="group relative min-h-[190px] p-5 transition hover:bg-stone-50">
                    <div className="flex items-start justify-between gap-4">
                      <span className={`grid h-12 w-12 place-items-center rounded-md ring-1 transition group-hover:-translate-y-0.5 ${item.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold text-stone-300">{item.code}</span>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-base font-semibold text-stone-950">{item.title}</h3>
                      <p className="mt-2 max-w-[220px] text-sm leading-6 text-stone-600">{item.text}</p>
                    </div>
                    <div className="absolute bottom-0 left-5 right-5 h-0.5 origin-left scale-x-0 bg-stone-950 transition duration-300 group-hover:scale-x-100" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
