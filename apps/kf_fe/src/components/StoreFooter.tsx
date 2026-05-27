import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="text-lg font-semibold tracking-normal">Korea Fashion</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            Cửa hàng thời trang phong cách Hàn Quốc với các item dễ phối cho đi học,
            đi làm và xuống phố hằng ngày.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase text-white/60">Liên kết</div>
          <div className="mt-3 grid gap-2 text-sm text-white/75">
            <Link href="/products" className="hover:text-white">Sản phẩm</Link>
            <Link href="/cart" className="hover:text-white">Giỏ hàng</Link>
            <Link href="/profile" className="hover:text-white">Tài khoản</Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase text-white/60">Liên hệ</div>
          <div className="mt-3 grid gap-2 text-sm text-white/75">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              0900 000 000
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              hello@koreafashion.vn
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Cần Thơ, Việt Nam
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
