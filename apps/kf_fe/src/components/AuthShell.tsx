"use client";

import { ArrowLeft, LockKeyhole, PackageCheck, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthShellProps = {
  children: ReactNode;
  description: string;
  footer: ReactNode;
  title: string;
};

const highlights = [
  {
    accent: "bg-rose-100 text-rose-950",
    description: "Giữ lại sản phẩm yêu thích và thông tin cần dùng cho lần mua tiếp theo.",
    icon: ShoppingBag,
    title: "Giỏ hàng liền mạch",
  },
  {
    accent: "bg-emerald-100 text-emerald-950",
    description: "Xem trạng thái xử lý, giao hàng và lịch sử mua sắm rõ ràng.",
    icon: PackageCheck,
    title: "Đơn hàng dễ theo dõi",
  },
  {
    accent: "bg-stone-100 text-stone-950",
    description: "Một tài khoản bảo mật cho khách hàng và đội ngũ quản trị.",
    icon: LockKeyhole,
    title: "Phiên đăng nhập an toàn",
  },
];

export function AuthShell({ children, description, footer, title }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ef] text-stone-950">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1800&q=85')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.78),rgba(15,23,42,0.38)_46%,rgba(247,244,239,0.94)_47%,rgba(247,244,239,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0))]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[minmax(0,1fr)_500px]">
        <section className="hidden min-h-screen flex-col justify-between px-8 py-8 text-white lg:flex xl:px-12">
          <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/82 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Korea Fashion
          </Link>

          <div className="max-w-xl pb-10">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/12 px-3 py-2 text-sm font-medium text-white/88 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-rose-200" />
              Seoul daily wear
            </div>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold leading-[1.05] tracking-normal">
              Tủ đồ đẹp hơn khi tài khoản cũng gọn gàng.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/76">
              Lưu phiên mua sắm, xem lại đơn hàng và quản lý thông tin cá nhân trong một trải nghiệm nhẹ nhàng.
            </p>
          </div>

          <div className="max-w-xl cursor-default select-none overflow-hidden rounded-lg border border-white/16 bg-white/12 shadow-2xl shadow-stone-950/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/12 px-4 py-3.5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-white/52">Korea Fashion account</div>
                <div className="mt-1 text-sm font-semibold text-white">Mua sắm gọn hơn sau một lần đăng nhập</div>
              </div>
              <div className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-stone-950 shadow-sm">
                3 tiện ích
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {highlights.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="group grid grid-cols-[36px_48px_1fr] items-start gap-3 px-4 py-4 transition hover:bg-white/8">
                    <span className="pt-1 text-xs font-semibold text-white/36">{String(index + 1).padStart(2, "0")}</span>
                    <span className={`grid h-12 w-12 place-items-center rounded-md shadow-sm transition group-hover:-translate-y-0.5 ${item.accent}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{item.title}</span>
                      <span className="mt-1.5 block max-w-sm text-sm leading-5 text-white/66">{item.description}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-normal text-stone-950">
                <ArrowLeft className="h-4 w-4" />
                Korea Fashion
              </Link>
              <div className="inline-flex items-center gap-2 rounded-md bg-white/80 px-3 py-2 text-xs font-medium text-emerald-800 shadow-sm ring-1 ring-emerald-900/10 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Bảo mật
              </div>
            </div>

            <Card className="overflow-hidden border-white/70 bg-white/88 shadow-2xl shadow-stone-950/12 backdrop-blur-xl">
              <div className="h-1.5 bg-[linear-gradient(90deg,#0f172a,#be123c,#047857)]" />
              <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-5">
                <div className="mb-5 hidden items-center justify-between lg:flex">
                  <Link href="/" className="text-lg font-semibold tracking-normal text-stone-950">
                    Korea Fashion
                  </Link>
                  <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                    <ShieldCheck className="h-4 w-4" />
                    Bảo mật
                  </div>
                </div>
                <CardTitle className="text-3xl font-semibold tracking-normal text-stone-950">{title}</CardTitle>
                <CardDescription className="mt-3 text-sm leading-6 text-stone-600">{description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
                {children}
                <div className="mt-6 border-t border-stone-200 pt-5">{footer}</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
