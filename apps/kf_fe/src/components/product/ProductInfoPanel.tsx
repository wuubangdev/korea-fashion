"use client";

import { Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { ProductRating } from "@/components/ProductRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

const sizes = ["S", "M", "L", "XL"];
const colors = [
  { label: "Kem", value: "bg-stone-100" },
  { label: "Đen", value: "bg-stone-950" },
  { label: "Hồng", value: "bg-rose-300" },
];

export function ProductInfoPanel({ product }: { product: Product }) {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Kem");

  return (
    <Card className="h-full min-w-0 shadow-none">
      <CardContent className="p-5 sm:p-6 lg:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase text-rose-700">{product.brand || "Korea Fashion"}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">{product.name}</h1>
            <div className="mt-3">
              <ProductRating rating={product.ratingAverage} count={product.reviewCount} size="md" />
            </div>
          </div>
          {product.origin ? <Badge>{product.origin}</Badge> : null}
        </div>
        <div className="mt-4 text-2xl font-semibold">{formatMoney(product.price)}</div>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {product.description || "Sản phẩm phong cách Hàn Quốc, dễ phối trong nhiều outfit hằng ngày."}
        </p>

        <div className="mt-5 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-[92px_1fr] sm:items-center">
            <div className="text-sm font-medium text-stone-800">Kích thước</div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`h-8 min-w-10 rounded-md border px-2.5 text-xs font-semibold transition ${
                    selectedSize === size
                      ? "border-stone-950 bg-stone-950 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-950"
                  }`}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[92px_1fr] sm:items-center">
            <div className="text-sm font-medium text-stone-800">Màu sắc</div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.label}
                  className={`flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition ${
                    selectedColor === color.label ? "border-stone-950" : "border-stone-300 hover:border-stone-950"
                  }`}
                  type="button"
                  onClick={() => setSelectedColor(color.label)}
                >
                  <span className={`h-4 w-4 rounded-full border border-stone-300 ${color.value}`} />
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[92px_1fr] sm:items-center">
            <div className="text-sm font-medium text-stone-800">Số lượng</div>
            <div className="flex h-8 w-[116px] items-center justify-between rounded-md border border-stone-300 bg-white">
              <button
                className="flex h-8 w-8 items-center justify-center text-stone-600 hover:text-stone-950"
                type="button"
                aria-label="Giảm số lượng"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold">{quantity}</span>
              <button
                className="flex h-8 w-8 items-center justify-center text-stone-600 hover:text-stone-950"
                type="button"
                aria-label="Tăng số lượng"
                onClick={() => setQuantity((value) => value + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 text-sm text-stone-600">
          <Policy icon={<Truck className="h-4 w-4" />} text="Giao hàng nội thành dự kiến 1-2 ngày." />
          <Policy icon={<RotateCcw className="h-4 w-4" />} text="Hỗ trợ đổi size trong 7 ngày nếu sản phẩm còn tag." />
          <Policy icon={<ShieldCheck className="h-4 w-4" />} text="Kiểm tra đơn hàng và thanh toán qua hệ thống." />
        </div>
        <Button className="mt-5 h-10 w-full" onClick={() => cart.add(product, quantity)}>
          <ShoppingBag className="h-4 w-4" />
          Thêm vào giỏ
        </Button>
        <p className="mt-3 text-center text-xs text-stone-500">
          Đã chọn: size {selectedSize}, màu {selectedColor}
        </p>
      </CardContent>
    </Card>
  );
}

function Policy({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-stone-50 p-3">
      <span className="text-rose-700">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
