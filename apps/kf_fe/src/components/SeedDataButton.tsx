"use client";

import { Database } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { createCategory, createProduct } from "@/lib/api/domains/catalog";

const categories = [
  {
    code: "outerwear",
    name: "Outerwear",
    description: "Áo khoác, blazer và trench coat phong cách Hàn Quốc.",
  },
  {
    code: "daily",
    name: "Daily essentials",
    description: "Các item dễ mặc hằng ngày và dễ phối đồ.",
  },
  {
    code: "accessories",
    name: "Accessories",
    description: "Túi, mũ, kính và phụ kiện hoàn thiện outfit.",
  },
];

const products = [
  {
    name: "Seoul cropped blazer",
    description: "Blazer dáng ngắn, form gọn, phù hợp phối cùng chân váy hoặc quần suông.",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    price: 1290000,
    brand: "Korea Fashion",
    origin: "Korea",
  },
  {
    name: "Minimal knit cardigan",
    description: "Cardigan len mỏng, mềm, dễ layer cho outfit hằng ngày.",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    price: 790000,
    brand: "KF Studio",
    origin: "Korea",
  },
  {
    name: "Soft pleated skirt",
    description: "Chân váy xếp ly mềm, lên form nhẹ và dễ phối cùng áo knit.",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    price: 620000,
    brand: "Seoul Line",
    origin: "Korea",
  },
  {
    name: "Relaxed wide-leg pants",
    description: "Quần ống rộng lưng cao, chất liệu đứng form cho đi làm và xuống phố.",
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
  const { notify } = useToast();

  async function seedData() {
    setIsLoading(true);
    setMessage(null);

    const results = await Promise.allSettled([
      ...categories.map((category) => createCategory(category)),
      ...products.map((product) => createProduct(product)),
    ]);

    const created = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.length - created;

    const resultMessage = `Đã gọi API tạo dữ liệu mẫu: ${created} thành công, ${failed} bỏ qua/lỗi.`;
    setMessage(resultMessage);
    notify({
      message: resultMessage,
      title: failed > 0 ? "Tạo dữ liệu mẫu hoàn tất một phần" : "Tạo dữ liệu mẫu thành công",
      type: failed > 0 ? "error" : "success",
    });
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
