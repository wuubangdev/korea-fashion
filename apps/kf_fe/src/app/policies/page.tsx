import { ClipboardCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const policySections = [
  {
    icon: ClipboardCheck,
    title: "Nội quy mua hàng",
    items: [
      "Cung cấp đúng thông tin nhận hàng và số điện thoại liên hệ.",
      "Kiểm tra kỹ sản phẩm, size, màu sắc trước khi xác nhận đơn.",
      "Không sử dụng thông tin giả hoặc đặt đơn gây ảnh hưởng đến vận hành cửa hàng.",
    ],
  },
  {
    icon: Truck,
    title: "Giao hàng",
    items: [
      "Đơn hàng được xử lý theo thứ tự xác nhận thành công.",
      "Thời gian giao phụ thuộc khu vực nhận hàng và đối tác vận chuyển.",
      "Korea Fashion sẽ liên hệ nếu đơn hàng cần bổ sung thông tin.",
    ],
  },
  {
    icon: RotateCcw,
    title: "Đổi trả",
    items: [
      "Sản phẩm đổi trả cần còn tem, nhãn và chưa qua sử dụng.",
      "Yêu cầu đổi trả cần gửi kèm hình ảnh tình trạng sản phẩm.",
      "Một số sản phẩm khuyến mãi hoặc đặt riêng có thể không áp dụng đổi trả.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật",
    items: [
      "Thông tin tài khoản chỉ dùng cho xử lý đơn hàng và hỗ trợ khách hàng.",
      "Không chia sẻ mật khẩu hoặc mã xác thực cho bất kỳ bên thứ ba nào.",
      "Liên hệ cửa hàng ngay khi phát hiện truy cập bất thường.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Chính sách</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Nội quy & chính sách</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Các quy định mua hàng, giao nhận, đổi trả và bảo mật áp dụng tại Korea Fashion.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
        {policySections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-6 text-stone-600">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 rounded-md border border-stone-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-stone-950">Cần hỗ trợ thêm?</h2>
            <p className="mt-1 text-sm text-stone-600">Liên hệ cửa hàng để được xử lý nhanh hơn.</p>
          </div>
          <Link href="/contact">
            <Button>Liên hệ</Button>
          </Link>
        </div>
      </section>

      <StoreFooter />
    </main>
  );
}
