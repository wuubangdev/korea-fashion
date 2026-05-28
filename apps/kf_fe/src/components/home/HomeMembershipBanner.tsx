"use client";

import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeMembershipBanner() {
  return (
    <section className="bg-rose-700 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/75">
            <BadgeCheck className="h-4 w-4" />
            Thành viên Korea Fashion
          </div>
          <h2 className="mt-2 text-2xl font-semibold">Nhận ưu đãi cho đơn hàng đầu tiên</h2>
        </div>
        <Link href="/register">
          <Button className="bg-white text-rose-700 hover:bg-rose-50">Tạo tài khoản</Button>
        </Link>
      </div>
    </section>
  );
}
