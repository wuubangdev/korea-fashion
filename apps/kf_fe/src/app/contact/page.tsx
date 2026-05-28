import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const contactItems = [
  {
    icon: Phone,
    label: "Hotline",
    value: "0900 000 000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@koreafashion.vn",
  },
  {
    icon: MapPin,
    label: "Địa chỉ",
    value: "Cần Thơ, Việt Nam",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Liên hệ</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Liên hệ Korea Fashion</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Gửi yêu cầu hỗ trợ, phản hồi đơn hàng hoặc trao đổi về sản phẩm.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <Card className="border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="h-5 w-5" />
              Gửi thông tin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <label className="block text-sm font-medium text-stone-700">
                Họ tên
                <Input className="mt-1" placeholder="Tên của bạn" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Email hoặc số điện thoại
                <Input className="mt-1" placeholder="you@example.com" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Nội dung
                <textarea
                  className="mt-1 min-h-36 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  placeholder="Bạn cần hỗ trợ điều gì?"
                />
              </label>
              <Button className="w-fit" type="button">
                Gửi liên hệ
              </Button>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-stone-200 shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-stone-100 text-stone-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-stone-500">{item.label}</p>
                    <p className="mt-1 font-semibold text-stone-950">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Button asChild variant="outline" className="w-full">
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </aside>
      </section>

      <StoreFooter />
    </main>
  );
}
