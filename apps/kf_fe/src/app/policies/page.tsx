import { ChevronDown, ClipboardCheck, HelpCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const policySections = [
  {
    icon: ClipboardCheck,
    title: "Nội quy mua hàng",
    summary: "Các thông tin cần kiểm tra trước khi đặt đơn.",
    items: [
      "Cung cấp đúng thông tin nhận hàng và số điện thoại liên hệ.",
      "Kiểm tra kỹ sản phẩm, size, màu sắc trước khi xác nhận đơn.",
      "Không sử dụng thông tin giả hoặc đặt đơn gây ảnh hưởng đến vận hành cửa hàng.",
    ],
  },
  {
    icon: Truck,
    title: "Giao hàng",
    summary: "Quy trình xử lý và bàn giao đơn hàng.",
    items: [
      "Đơn hàng được xử lý theo thứ tự xác nhận thành công.",
      "Thời gian giao phụ thuộc khu vực nhận hàng và đối tác vận chuyển.",
      "Korea Fashion sẽ liên hệ nếu đơn hàng cần bổ sung thông tin.",
    ],
  },
  {
    icon: RotateCcw,
    title: "Đổi trả",
    summary: "Điều kiện tiếp nhận đổi trả sản phẩm.",
    items: [
      "Sản phẩm đổi trả cần còn tem, nhãn và chưa qua sử dụng.",
      "Yêu cầu đổi trả cần gửi kèm hình ảnh tình trạng sản phẩm.",
      "Một số sản phẩm khuyến mãi hoặc đặt riêng có thể không áp dụng đổi trả.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật",
    summary: "Cách Korea Fashion bảo vệ thông tin khách hàng.",
    items: [
      "Thông tin tài khoản chỉ dùng cho xử lý đơn hàng và hỗ trợ khách hàng.",
      "Không chia sẻ mật khẩu hoặc mã xác thực cho bất kỳ bên thứ ba nào.",
      "Liên hệ cửa hàng ngay khi phát hiện truy cập bất thường.",
    ],
  },
];

const faqs = [
  {
    question: "Tôi có thể đổi size sau khi nhận hàng không?",
    answer: "Có, nếu sản phẩm còn tem nhãn, chưa qua sử dụng và yêu cầu được gửi trong thời gian hỗ trợ đổi trả của cửa hàng.",
  },
  {
    question: "Bao lâu thì đơn hàng được giao?",
    answer: "Thời gian giao phụ thuộc địa chỉ nhận hàng và đơn vị vận chuyển. Korea Fashion sẽ cập nhật trạng thái khi đơn được xác nhận.",
  },
  {
    question: "Làm sao để được tư vấn chọn size?",
    answer: "Bạn có thể gửi chiều cao, cân nặng và mẫu sản phẩm qua trang liên hệ hoặc hotline để được tư vấn nhanh hơn.",
  },
  {
    question: "Sản phẩm khuyến mãi có được đổi trả không?",
    answer: "Một số sản phẩm khuyến mãi có thể có điều kiện riêng. Vui lòng kiểm tra thông tin sản phẩm hoặc liên hệ cửa hàng trước khi đặt.",
  },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Chính sách</p>
          <div className="mt-2 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Nội quy, chính sách & FAQ</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                Các quy định mua hàng, giao nhận, đổi trả, bảo mật và câu hỏi thường gặp tại Korea Fashion.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-600">
              <span className="font-semibold text-stone-950">Mẹo nhanh:</span> Chuẩn bị mã đơn hàng và hình ảnh sản phẩm nếu bạn cần hỗ trợ đổi trả.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
        {policySections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="hover-lift overflow-hidden border-stone-200 shadow-sm">
              <CardHeader className="border-b border-stone-100 p-5">
                <CardTitle className="flex items-start gap-3 text-lg">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-stone-100 text-stone-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block">{section.title}</span>
                    <span className="mt-1 block text-sm font-normal leading-5 text-stone-600">{section.summary}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <div>
          <div className="sticky top-20 rounded-lg border border-stone-200 bg-stone-950 p-5 text-white shadow-lg shadow-stone-950/10">
            <div className="flex items-center gap-2 font-semibold">
              <HelpCircle className="h-5 w-5" />
              Câu hỏi thường gặp
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Những tình huống phổ biến nhất khi mua sắm tại Korea Fashion. Nếu vẫn cần hỗ trợ, gửi yêu cầu để cửa hàng xử lý trực tiếp.
            </p>
            <Button asChild variant="outline" className="mt-5 w-full border-white/20 bg-white/10 text-white hover:bg-white hover:text-stone-950">
              <Link href="/contact">Liên hệ hỗ trợ</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="hover-lift group rounded-lg border border-stone-200 bg-white p-5 shadow-sm open:shadow-md" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-stone-950">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-stone-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-6 text-stone-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <StoreFooter />
    </main>
  );
}
