"use client";

import { BadgeCheck, LogIn, MessageSquareText, Star } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { ProductRating } from "@/components/ProductRating";
import { SafeImage } from "@/components/SafeImage";
import { useToast } from "@/components/ToastProvider";
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
  const { notify } = useToast();

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
      notify({
        message: "Vui lòng đăng nhập trước khi gửi đánh giá sản phẩm.",
        title: "Cần đăng nhập",
        type: "info",
      });
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
      notify({
        message: "Cảm ơn bạn đã chia sẻ trải nghiệm với sản phẩm này.",
        title: "Đã gửi đánh giá",
        type: "success",
      });
      reviews.revalidate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể gửi đánh giá.";
      setMessage(errorMessage);
      notify({
        message: errorMessage,
        title: "Gửi đánh giá thất bại",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <Card className="overflow-hidden border-stone-200 shadow-lg shadow-stone-950/5">
        <CardHeader className="border-b border-stone-200 bg-[#fbfaf7] p-6">
          <CardTitle className="flex flex-col gap-4 text-xl sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-stone-950 text-white">
                <MessageSquareText className="h-5 w-5" />
              </span>
              <span>
                <span className="block">Đánh giá sản phẩm</span>
                <span className="mt-1 block text-sm font-normal text-stone-500">Trải nghiệm thực tế từ khách hàng</span>
              </span>
            </span>
            <span className="rounded-md bg-white px-3 py-2 shadow-sm">
              <ProductRating rating={product.ratingAverage} count={product.reviewCount} size="md" />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          {reviews.error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{reviews.error}</div>
          ) : items.length ? (
            <div className="grid gap-4">
              {items.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
              Chưa có đánh giá hiển thị cho sản phẩm này.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-stone-200 shadow-lg shadow-stone-950/5">
        <CardHeader className="border-b border-stone-200 bg-white p-6">
          <CardTitle className="text-xl">Viết đánh giá</CardTitle>
          <p className="mt-1 text-sm leading-6 text-stone-600">Chấm sao và chia sẻ cảm nhận của bạn về sản phẩm.</p>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
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
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                <div className="mb-2 text-xs font-semibold uppercase text-stone-500">Mức đánh giá</div>
                <div className="flex gap-1" aria-label="Chọn số sao">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className="rounded p-0.5 transition hover:-translate-y-0.5"
                      aria-label={`${index + 1} sao`}
                      onClick={() => setRating(index + 1)}
                    >
                      <Star className={`h-7 w-7 ${index < rating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-sm font-semibold text-stone-800">
                Tiêu đề
                <Input className="mt-2 h-11" placeholder="Cảm nhận ngắn" value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <label className="block text-sm font-semibold text-stone-800">
                Nội dung
                <textarea
                  className="mt-2 min-h-32 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Chia sẻ trải nghiệm của bạn"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              </label>
              {message ? <p className="text-sm text-stone-600">{message}</p> : null}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi đánh giá"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const name = review.reviewerName || "Khách hàng";

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm shadow-stone-950/5">
      <div className="grid gap-3 sm:grid-cols-[48px_1fr]">
        <Avatar name={name} src={review.reviewerAvatarUrl} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-semibold text-stone-950">{name}</div>
              {review.verifiedPurchase ? (
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Đã mua hàng
                </div>
              ) : null}
            </div>
            <ProductRating rating={review.rating} />
          </div>
          {review.title ? <h3 className="mt-3 font-semibold text-stone-950">{review.title}</h3> : null}
          {review.content ? <p className="mt-2 text-sm leading-6 text-stone-600">{review.content}</p> : null}
          {review.adminReply ? (
            <div className="mt-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-600">
              <span className="font-medium text-stone-950">Phản hồi cửa hàng: </span>
              {review.adminReply}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      <SafeImage
        alt={name}
        className="h-12 w-12 rounded-full border border-stone-200"
        sizes="48px"
        src={src}
      />
    );
  }

  return (
    <div className="grid h-12 w-12 place-items-center rounded-full bg-stone-950 text-sm font-semibold text-white">
      {getInitials(name)}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase() || "KF";
}
