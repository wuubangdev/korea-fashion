"use client";

import { BadgeCheck, LogIn, Star } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { ProductRating } from "@/components/ProductRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiResource } from "@/hooks/useApiResource";
import { accountApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import type { PageResult, Product, Review } from "@/types/api";

export function ProductReviews({ product }: { product: Product }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setIsLoggedIn(Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY)));
    });
  }, []);

  const reviews = useApiResource<PageResult<Review>>({
    path: `/api/products/${product.id}/reviews`,
    query: { page: 0, size: 5, sort: "reviewedAt,desc" },
  });
  const items = reviews.data?.content ?? [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setMessage("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      await accountApi.createReview(
        {
          content: content.trim() || undefined,
          productId: product.id,
          rating,
          title: title.trim() || undefined,
        },
        { token },
      );
      setTitle("");
      setContent("");
      setRating(5);
      setMessage("Đã gửi đánh giá của bạn.");
      reviews.revalidate();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể gửi đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {reviews.error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{reviews.error}</div>
          ) : items.length ? (
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
          {isLoggedIn === null ? (
            <div className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
              Đang kiểm tra phiên đăng nhập của bạn.
            </div>
          ) : !isLoggedIn ? (
            <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm leading-6 text-stone-600">Bạn cần đăng nhập để chấm sao và viết đánh giá sản phẩm.</p>
              <Button asChild className="mt-4 w-full">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Link>
              </Button>
            </div>
          ) : (
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="flex gap-1" aria-label="Chọn số sao">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button key={index} type="button" aria-label={`${index + 1} sao`} onClick={() => setRating(index + 1)}>
                    <Star className={`h-6 w-6 ${index < rating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium text-stone-700">
                Tiêu đề
                <Input className="mt-1" placeholder="Cảm nhận ngắn" value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Nội dung
                <textarea
                  className="mt-1 min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  placeholder="Chia sẻ trải nghiệm của bạn"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              </label>
              {message ? <p className="text-sm text-stone-600">{message}</p> : null}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
