"use client";

import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: <Truck className="h-5 w-5" />,
    text: "Đóng gói và bàn giao đơn trong 24h.",
    title: "Giao hàng nhanh",
  },
  {
    icon: <RotateCcw className="h-5 w-5" />,
    text: "Hỗ trợ đổi size cho sản phẩm còn tag.",
    title: "Đổi size linh hoạt",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    text: "Đơn hàng được lưu và theo dõi qua hệ thống.",
    title: "Thanh toán an toàn",
  },
];

export function HomeValues() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
      {values.map((item) => (
        <Value key={item.title} icon={item.icon} title={item.title} text={item.text} />
      ))}
    </section>
  );
}

function Value({ icon, text, title }: { icon: ReactNode; text: string; title: string }) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-700 text-white">{icon}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="mt-1 text-sm text-stone-600">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
