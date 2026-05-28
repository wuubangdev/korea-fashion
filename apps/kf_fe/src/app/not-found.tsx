import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
      <section className="w-full max-w-lg rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-medium uppercase text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Không tìm thấy trang</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Đường dẫn này không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Link href="/">
            <Button>Về cửa hàng</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline">Về quản trị</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
