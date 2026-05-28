import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-md border border-stone-200 bg-white p-8">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-700">
              <Heart aria-hidden className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">Danh sách yêu thích</h1>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Khu vực lưu sản phẩm yêu thích đang sẵn sàng cho giao diện. Khi tính năng yêu thích được nối dữ liệu,
                các sản phẩm đã lưu sẽ hiển thị tại đây.
              </p>
            </div>
            <Button asChild className="w-fit">
              <Link href="/products">
                <ShoppingBag aria-hidden className="h-4 w-4" />
                Xem sản phẩm
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
}
