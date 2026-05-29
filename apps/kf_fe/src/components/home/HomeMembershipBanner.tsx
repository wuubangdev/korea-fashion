"use client";

import { Heart, PackageCheck, Ticket, TicketPercent, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const perks = [
  {
    icon: Ticket,
    text: "Mã ưu đãi cho đơn đầu tiên",
  },
  {
    icon: Heart,
    text: "Lưu wishlist và sản phẩm yêu thích",
  },
  {
    icon: PackageCheck,
    text: "Theo dõi trạng thái đơn hàng",
  },
];

export function HomeMembershipBanner() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=85')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,250,247,0.96),rgba(251,250,247,0.82)_48%,rgba(251,250,247,0.48))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(68,64,60,0.20)_1px,transparent_0)] [background-size:12px_12px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-lg border border-white/75 bg-white/58 p-6 text-stone-950 shadow-2xl shadow-stone-950/10 backdrop-blur-md sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-white/70 px-3 py-2 text-sm font-medium text-rose-800 backdrop-blur">
              <UserPlus className="h-4 w-4" />
              Thành viên Korea Fashion
            </div>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
              Nhận ưu đãi cho đơn hàng đầu tiên
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-stone-600 sm:text-base">
              Tạo tài khoản để giữ lại sản phẩm yêu thích, quản lý đơn hàng và nhận các quyền lợi dành riêng cho thành viên.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {perks.map((perk) => {
                const Icon = perk.icon;

                return (
                  <div key={perk.text} className="rounded-md border border-stone-200 bg-white/65 p-3 text-sm leading-5 text-stone-700 shadow-sm shadow-stone-950/5 backdrop-blur">
                    <Icon className="mb-2 h-4 w-4 text-rose-700" />
                    {perk.text}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-white/80 bg-white/72 p-5 shadow-xl shadow-stone-950/10 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">Welcome offer</div>
                <div className="mt-2 text-4xl font-semibold tracking-normal">-10%</div>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-md bg-white text-rose-700 shadow-sm">
                <TicketPercent className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Dùng cho đơn hàng đầu tiên sau khi đăng ký tài khoản Korea Fashion.
            </p>
            <Link href="/register" className="mt-5 block">
              <Button className="h-12 w-full bg-rose-700 text-white hover:bg-rose-800 hover:shadow-rose-950/20">
                <UserPlus className="h-4 w-4" />
                Tạo tài khoản
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
