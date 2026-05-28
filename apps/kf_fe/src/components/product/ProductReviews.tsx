"use client";

import { BadgeCheck, Star } from "lucide-react";
import { useState } from "react";
import { ProductRating } from "@/components/ProductRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiResource } from "@/hooks/useApiResource";
import type { PageResult, Product, Review } from "@/types/api";

export function ProductReviews({ product }: { product: Product }) {
  const [rating, setRating] = useState(5);
  const reviews = useApiResource<PageResult<Review>>({
    path: "/api/reviews",
    query: { page: 0, productId: product.id, size: 5, sort: "reviewedAt,desc", status: "APPROVED" },
  });
  const items = reviews.data?.content ?? [];

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="border-stone-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4 text-xl">
            <span>Đánh giá sản phẩm</span>
            <ProductRating rating={product.ratingAverage} count={product.reviewCount} size="md" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length ? (
            <div className="divide-y divide-stone-200">
              {items.map((review) => (
                <article key={review.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-stone-950">{review.reviewerName || "Khách hàng"}</div>
                      {review.verifiedPurchase ? (
                        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Đã mua hàng
                        </div>
                      ) : null}
                    </div>
                    <ProductRating rating={review.rating} />
                  </div>
                  {review.title ? <h3 className="mt-3 font-medium text-stone-950">{review.title}</h3> : null}
                  {review.content ? <p className="mt-2 text-sm leading-6 text-stone-600">{review.content}</p> : null}
                  {review.adminReply ? (
                    <div className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-600">
                      <span className="font-medium text-stone-950">Phản hồi cửa hàng: </span>
                      {review.adminReply}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
              Chưa có đánh giá hiển thị cho sản phẩm này.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Viết đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <button key={index} type="button" aria-label={`${index + 1} sao`} onClick={() => setRating(index + 1)}>
                <Star className={`h-6 w-6 ${index < rating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
              </button>
            ))}
          </div>
          <form className="grid gap-3">
            <label className="block text-sm font-medium text-stone-700">
              Tên hiển thị
              <Input className="mt-1" placeholder="Tên của bạn" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Tiêu đề
              <Input className="mt-1" placeholder="Cảm nhận ngắn" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Nội dung
              <textarea
                className="mt-1 min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                placeholder="Chia sẻ trải nghiệm của bạn"
              />
            </label>
            <Button type="button" className="w-full">
              Gửi đánh giá
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
