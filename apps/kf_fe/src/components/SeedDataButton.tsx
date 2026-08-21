"use client";

import { Database } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCategory, createProduct } from "@/lib/store-api";

const categories = [
  {
    code: "outerwear",
    name: "Outerwear",
    description: "Ao khoac, blazer va trench coat phong cach Han Quoc.",
  },
  {
    code: "daily",
    name: "Daily essentials",
    description: "Cac item de mac hang ngay va de phoi do.",
  },
  {
    code: "accessories",
    name: "Accessories",
    description: "Tui, mu, kinh va phu kien hoan thien outfit.",
  },
];

const products = [
  {
    name: "Seoul cropped blazer",
    description: "Blazer dang ngan, form gon, phu hop phoi cung chan vay hoac quan suong.",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    price: 1290000,
    brand: "Korea Fashion",
    origin: "Korea",
  },
  {
    name: "Minimal knit cardigan",
    description: "Cardigan len mong, mem, de layer cho outfit hang ngay.",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    price: 790000,
    brand: "KF Studio",
    origin: "Korea",
  },
  {
    name: "Soft pleated skirt",
    description: "Chan vay xep ly mem, len form nhe va de phoi cung ao knit.",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    price: 620000,
    brand: "Seoul Line",
    origin: "Korea",
  },
  {
    name: "Relaxed wide-leg pants",
    description: "Quan ong rong lung cao, chat lieu dung form cho di lam va xuong pho.",
    imageUrl:
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=900&q=80",
    price: 880000,
    brand: "K Style",
    origin: "Vietnam",
  },
];

export function SeedDataButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function seedData() {
    setIsLoading(true);
    setMessage(null);

    const results = await Promise.allSettled([
      ...categories.map((category) => createCategory(category)),
      ...products.map((product) => createProduct(product)),
    ]);

    const created = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.length - created;

    setMessage(`Đã gọi API tạo dữ liệu mẫu: ${created} thành công, ${failed} bỏ qua/lỗi.`);
    setIsLoading(false);
  }

  return (
    <div>
      <Button onClick={seedData} disabled={isLoading} variant="outline">
        <Database className="h-4 w-4" />
        {isLoading ? "Đang tạo dữ liệu..." : "Tạo dữ liệu mẫu"}
      </Button>
      {message ? <p className="mt-2 text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
