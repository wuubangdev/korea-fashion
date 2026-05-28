"use client";

import { ArrowLeft, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
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
  "Quản lý đơn hàng và tài khoản bảo mật",
  "Theo dõi giỏ hàng trên cùng một phiên đăng nhập",
  "Truy cập nhanh khu quản trị khi có quyền phù hợp",
];

export function AuthShell({ children, description, footer, title }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[minmax(0,1fr)_480px]">
        <section className="relative hidden overflow-hidden bg-stone-950 text-white lg:block">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=85')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="absolute inset-0 bg-stone-950/55" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Korea Fashion
            </Link>

            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white/85">
                <Sparkles className="h-4 w-4 text-rose-200" />
                Seoul daily wear
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal">
                Không gian tài khoản cho trải nghiệm mua sắm liền mạch.
              </h1>
              <p className="mt-4 text-base leading-7 text-white/70">
                Đăng nhập để lưu phiên làm việc, quản lý thông tin cá nhân và thao tác với hệ thống Korea Fashion.
              </p>
            </div>

            <div className="grid gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-rose-200" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-normal">
                Korea Fashion
              </Link>
              <div className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                <ShieldCheck className="h-4 w-4" />
                Bảo mật
              </div>
            </div>

            <Card className="border-stone-200 shadow-md">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-2xl tracking-normal text-stone-950">{title}</CardTitle>
                <CardDescription className="mt-2 leading-6 text-stone-600">{description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-3">
                {children}
                <div className="mt-5 border-t border-stone-200 pt-5">{footer}</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
