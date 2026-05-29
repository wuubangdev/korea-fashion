import { ChevronDown, ClipboardCheck, HelpCircle, LockKeyhole, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";

const policySections = [
  {
    anchor: "shopping",
    icon: ClipboardCheck,
    kicker: "01",
    title: "Nội quy mua hàng",
    summary: "Những điểm cần kiểm tra trước khi xác nhận đơn.",
    items: [
      "Cung cấp đúng thông tin nhận hàng và số điện thoại liên hệ.",
      "Kiểm tra kỹ sản phẩm, size, màu sắc trước khi xác nhận đơn.",
      "Không sử dụng thông tin giả hoặc đặt đơn gây ảnh hưởng đến vận hành cửa hàng.",
    ],
  },
  {
    anchor: "shipping",
    icon: Truck,
    kicker: "02",
    title: "Giao hàng",
    summary: "Quy trình xử lý, bàn giao và cập nhật trạng thái đơn.",
    items: [
      "Đơn hàng được xử lý theo thứ tự xác nhận thành công.",
      "Thời gian giao phụ thuộc khu vực nhận hàng và đối tác vận chuyển.",
      "Korea Fashion sẽ liên hệ nếu đơn hàng cần bổ sung thông tin.",
    ],
  },
  {
    anchor: "returns",
    icon: RotateCcw,
    kicker: "03",
    title: "Đổi trả",
    summary: "Điều kiện tiếp nhận đổi size, đổi mẫu hoặc trả hàng.",
    items: [
      "Sản phẩm đổi trả cần còn tem, nhãn và chưa qua sử dụng.",
      "Yêu cầu đổi trả cần gửi kèm hình ảnh tình trạng sản phẩm.",
      "Một số sản phẩm khuyến mãi hoặc đặt riêng có thể không áp dụng đổi trả.",
    ],
  },
  {
    anchor: "privacy",
    icon: ShieldCheck,
    kicker: "04",
    title: "Bảo mật",
    summary: "Cách Korea Fashion xử lý và bảo vệ thông tin khách hàng.",
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
    <main className="min-h-screen bg-[#f7f5f0] text-stone-950">
      <StoreHeader />

      <section className="border-b border-stone-200 bg-stone-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-rose-200">Chính sách Korea Fashion</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Rõ ràng từ lúc đặt hàng đến khi nhận sản phẩm.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              Tổng hợp quy định mua hàng, giao nhận, đổi trả, bảo mật và các câu hỏi thường gặp để bạn chủ động theo dõi đơn hàng.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-white text-stone-950">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">Thông tin minh bạch</div>
                <p className="mt-1 text-sm leading-6 text-white/70">Chuẩn bị mã đơn hàng và hình ảnh sản phẩm nếu cần hỗ trợ đổi trả.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {policySections.map((section) => (
            <a key={section.anchor} href={`#${section.anchor}`} className="group rounded-md border border-stone-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm">
              <div className="text-xs font-semibold text-rose-700">{section.kicker}</div>
              <div className="mt-1 text-sm font-semibold text-stone-950 group-hover:text-emerald-800">{section.title}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-stone-950">Nội dung</div>
            <div className="mt-3 grid gap-1">
              {policySections.map((section) => (
                <a key={section.anchor} href={`#${section.anchor}`} className="rounded-md px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-50 hover:text-stone-950">
                  {section.title}
                </a>
              ))}
              <a href="#faq" className="rounded-md px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-50 hover:text-stone-950">
                Câu hỏi thường gặp
              </a>
            </div>
            <div className="mt-4 rounded-md bg-stone-950 p-4 text-white">
              <div className="text-sm font-semibold">Cần hỗ trợ riêng?</div>
              <p className="mt-2 text-sm leading-6 text-white/70">Gửi yêu cầu trực tiếp để cửa hàng kiểm tra trường hợp của bạn.</p>
              <Button asChild className="mt-4 w-full bg-white text-stone-950 hover:bg-stone-100">
                <Link href="/contact">Liên hệ hỗ trợ</Link>
              </Button>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          {policySections.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.anchor} id={section.anchor} className="scroll-mt-24 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className="grid gap-5 p-5 sm:grid-cols-[180px_1fr] sm:p-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      <Icon className="h-4 w-4" />
                      {section.kicker}
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-normal">{section.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{section.summary}</p>
                  </div>
                  <div className="grid gap-3">
                    {section.items.map((item, index) => (
                      <div key={item} className="flex gap-3 rounded-md border border-stone-100 bg-stone-50/70 p-4">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-stone-700 shadow-sm">
                          {index + 1}
                        </span>
                        <p className="text-sm leading-6 text-stone-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}

          <section id="faq" className="scroll-mt-24 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-stone-100 text-stone-700">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-normal">Câu hỏi thường gặp</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">Các tình huống phổ biến nhất khi mua sắm tại Korea Fashion.</p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-stone-100 rounded-lg border border-stone-200">
              {faqs.map((faq, index) => (
                <details key={faq.question} className="group bg-white p-4 first:rounded-t-lg last:rounded-b-lg" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-stone-950">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 shrink-0 text-stone-500 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>

      <StoreFooter />
    </main>
  );
}
