"use client";

import { Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiResource } from "@/hooks/useApiResource";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

const sizes = ["S", "M", "L", "XL"];
const colors = [
  { label: "Kem", value: "bg-stone-100" },
  { label: "Đen", value: "bg-stone-950" },
  { label: "Hồng", value: "bg-rose-300" },
];

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Kem");
  const product = useApiResource<Product>({
    path: `/api/products/${params.id}`,
  });
  const currentProduct = product.data;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {product.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {product.error}
          </div>
        ) : null}

        {currentProduct ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="grid gap-4 md:grid-cols-[1fr_110px]">
              <div
                className="min-h-[560px] rounded-lg border border-stone-200 bg-stone-100"
                style={{
                  backgroundImage: currentProduct.imageUrl
                    ? `url('${currentProduct.imageUrl}')`
                    : undefined,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div className="hidden gap-3 md:grid">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-stone-200 bg-stone-100"
                    style={{
                      backgroundImage: currentProduct.imageUrl
                        ? `url('${currentProduct.imageUrl}')`
                        : undefined,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                ))}
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase text-rose-700">
                      {currentProduct.brand || "Korea Fashion"}
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-normal">
                      {currentProduct.name}
                    </h1>
                  </div>
                  {currentProduct.origin ? <Badge>{currentProduct.origin}</Badge> : null}
                </div>
                <div className="mt-6 text-2xl font-semibold">
                  {formatMoney(currentProduct.price)}
                </div>
                <p className="mt-5 text-sm leading-7 text-stone-600">
                  {currentProduct.description ||
                    "Sản phẩm phong cách Hàn Quốc, dễ phối trong nhiều outfit hằng ngày."}
                </p>

                <div className="mt-6">
                  <div className="text-sm font-medium text-stone-800">Kích thước</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`h-10 min-w-12 rounded-md border px-3 text-sm font-medium transition ${
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

                <div className="mt-5">
                  <div className="text-sm font-medium text-stone-800">Màu sắc</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.label}
                        className={`flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                          selectedColor === color.label
                            ? "border-stone-950"
                            : "border-stone-300 hover:border-stone-950"
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

                <div className="mt-5">
                  <div className="text-sm font-medium text-stone-800">Số lượng</div>
                  <div className="mt-2 flex h-10 w-36 items-center justify-between rounded-md border border-stone-300 bg-white">
                    <button
                      className="flex h-10 w-10 items-center justify-center text-stone-600 hover:text-stone-950"
                      type="button"
                      aria-label="Giảm số lượng"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold">{quantity}</span>
                    <button
                      className="flex h-10 w-10 items-center justify-center text-stone-600 hover:text-stone-950"
                      type="button"
                      aria-label="Tăng số lượng"
                      onClick={() => setQuantity((value) => value + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-stone-600">
                  <Policy icon={<Truck className="h-4 w-4" />} text="Giao hàng nội thành dự kiến 1-2 ngày." />
                  <Policy icon={<RotateCcw className="h-4 w-4" />} text="Hỗ trợ đổi size trong 7 ngày nếu sản phẩm còn tag." />
                  <Policy icon={<ShieldCheck className="h-4 w-4" />} text="Kiểm tra đơn hàng và thanh toán qua hệ thống." />
                </div>
                <Button className="mt-6 w-full" size="lg" onClick={() => cart.add(currentProduct, quantity)}>
                  <ShoppingBag className="h-4 w-4" />
                  Thêm vào giỏ
                </Button>
                <p className="mt-3 text-center text-xs text-stone-500">
                  Đã chọn: size {selectedSize}, màu {selectedColor}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-[560px] animate-pulse rounded-lg bg-slate-200" />
        )}
      </div>
      <StoreFooter />
    </main>
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
