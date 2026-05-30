"use client";

import { Clock3, Mail, MapPin, MessageCircle, Phone, Send, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { accountApi, contactMessagesApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";

type ContactFormState = {
  email: string;
  fullName: string;
  message: string;
  phone: string;
  subject: string;
};

const initialForm: ContactFormState = {
  email: "",
  fullName: "",
  message: "",
  phone: "",
  subject: "",
};

const contactItems = [
  {
    icon: Phone,
    label: "Hotline",
    value: "0900 000 000",
    note: "Hỗ trợ tư vấn size và trạng thái đơn hàng",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@koreafashion.vn",
    note: "Phản hồi trong ngày làm việc",
  },
  {
    icon: MapPin,
    label: "Địa chỉ",
    value: "Cần Thơ, Việt Nam",
    note: "Điểm tiếp nhận đổi trả theo lịch hẹn",
  },
];

const supportSteps = [
  "Gửi mã đơn hàng hoặc số điện thoại đã đặt.",
  "Đính kèm hình ảnh nếu cần hỗ trợ đổi trả.",
  "Theo dõi phản hồi qua email hoặc hotline.",
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return;
    }

    setProfileStatus("Đang lấy thông tin tài khoản...");
    accountApi.getProfile({ token })
      .then((user) => {
        setForm((current) => ({
          ...current,
          email: current.email || user.email || "",
          fullName: current.fullName || user.fullName || user.username || "",
          phone: current.phone || user.phone || "",
        }));
        setProfileStatus("Đã tự điền thông tin từ tài khoản của bạn.");
      })
      .catch(() => {
        setProfileStatus(null);
      });
  }, []);

  function updateField(key: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateContactForm(form);
    if (validationError) {
      setFormError(validationError);
      notify({ message: validationError, title: "Thông tin chưa hợp lệ", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await contactMessagesApi.submit({
        email: form.email.trim() || undefined,
        fullName: form.fullName.trim(),
        message: form.message.trim(),
        phone: form.phone.trim() || undefined,
        source: "CONTACT_PAGE",
        subject: form.subject.trim() || "Yêu cầu hỗ trợ",
      });
      setForm(initialForm);
      notify({
        message: "Korea Fashion đã nhận thông tin và sẽ phản hồi sớm.",
        title: "Đã gửi liên hệ",
        type: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể gửi liên hệ. Vui lòng thử lại.";
      setFormError(message);
      notify({ message, title: "Gửi liên hệ thất bại", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase text-rose-700">Liên hệ</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Korea Fashion luôn sẵn sàng hỗ trợ</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Gửi yêu cầu về sản phẩm, đơn hàng, đổi trả hoặc góp ý trải nghiệm mua sắm. Đội ngũ hỗ trợ sẽ phản hồi theo đúng thông tin bạn để lại.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-950 p-5 text-white shadow-lg shadow-stone-950/10">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-white/10">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Thời gian hỗ trợ</p>
                <p className="mt-1 text-sm text-white/70">09:00 - 21:00, tất cả các ngày</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <Card className="overflow-hidden border-stone-200 shadow-sm">
          <CardHeader className="border-b border-stone-200 bg-white p-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="h-5 w-5 text-emerald-700" />
              Gửi thông tin
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-stone-600">Điền càng rõ nội dung, đội ngũ hỗ trợ càng xử lý nhanh.</p>
            {profileStatus ? (
              <p className="mt-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{profileStatus}</p>
            ) : null}
          </CardHeader>
          <CardContent className="p-6">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-stone-800">
                  Họ tên
                  <Input
                    className="mt-2 h-11 rounded-lg"
                    placeholder="Tên của bạn"
                    value={form.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                  />
                </label>
                <label className="block text-sm font-semibold text-stone-800">
                  Số điện thoại
                  <Input
                    className="mt-2 h-11 rounded-lg"
                    placeholder="0900 000 000"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-stone-800">
                  Email
                  <Input
                    className="mt-2 h-11 rounded-lg"
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </label>
                <label className="block text-sm font-semibold text-stone-800">
                  Chủ đề
                  <Input
                    className="mt-2 h-11 rounded-lg"
                    placeholder="Tư vấn sản phẩm, đổi trả..."
                    value={form.subject}
                    onChange={(event) => updateField("subject", event.target.value)}
                  />
                </label>
              </div>
              <label className="block text-sm font-semibold text-stone-800">
                Nội dung
                <textarea
                  className="mt-2 min-h-40 w-full rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Bạn cần hỗ trợ điều gì?"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                />
              </label>
              {formError ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>
              ) : null}
              <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-stone-500">Thông tin chỉ dùng để xử lý yêu cầu hỗ trợ và không chia sẻ cho bên thứ ba.</p>
                <Button className="w-full sm:w-fit" disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="hover-lift border-stone-200 shadow-sm">
                <CardContent className="flex gap-4 p-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-stone-100 text-stone-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-stone-500">{item.label}</p>
                    <p className="mt-1 font-semibold text-stone-950">{item.value}</p>
                    <p className="mt-1 text-sm leading-5 text-stone-600">{item.note}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-stone-200 bg-stone-950 text-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 font-semibold">
                <ShoppingBag className="h-5 w-5" />
                Khi cần hỗ trợ đơn hàng
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                {supportSteps.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-5 w-full border-white/20 bg-white/10 text-white hover:bg-white hover:text-stone-950">
                <Link href="/products">Tiếp tục mua sắm</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>

      <StoreFooter />
    </main>
  );
}

function validateContactForm(form: ContactFormState) {
  if (!form.fullName.trim()) {
    return "Vui lòng nhập họ tên.";
  }

  if (!form.phone.trim() && !form.email.trim()) {
    return "Vui lòng nhập email hoặc số điện thoại để Korea Fashion phản hồi.";
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return "Email chưa đúng định dạng.";
  }

  if (!form.message.trim()) {
    return "Vui lòng nhập nội dung cần hỗ trợ.";
  }

  if (form.message.trim().length < 10) {
    return "Nội dung liên hệ cần tối thiểu 10 ký tự.";
  }

  return null;
}
