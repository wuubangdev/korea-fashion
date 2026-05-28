"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
      <section className="w-full max-w-lg rounded-md border border-red-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase text-red-700">Lỗi hệ thống</p>
        <h1 className="mt-2 text-2xl font-semibold">Không thể tải trang</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {error.message || "Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" onClick={() => window.location.assign("/")}>
            Về cửa hàng
          </Button>
        </div>
      </section>
    </main>
  );
}
