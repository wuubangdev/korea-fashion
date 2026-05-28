"use client";

import { Star } from "lucide-react";

type ProductRatingProps = {
  count?: number;
  rating?: number | string;
  size?: "sm" | "md";
};

export function ProductRating({ count, rating, size = "sm" }: ProductRatingProps) {
  const value = Math.max(0, Math.min(5, Number(rating ?? 0)));
  const rounded = Math.round(value);
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} sao`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`${iconSize} ${index < rounded ? "fill-amber-400 text-amber-400" : "text-stone-300"}`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-stone-600">
        {value ? value.toFixed(1) : "Chưa có"} {count ? `(${count})` : ""}
      </span>
    </div>
  );
}
