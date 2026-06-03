"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard, MapPin, PackageCheck, Phone, ShieldCheck, ShoppingBag, TicketPercent, Truck, UserRound, X, type LucideIcon } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { accountApi, ordersApi, storefrontApi } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import type { CreateOrderPayload, Order, User } from "@/types/api";

type CheckoutForm = {
  address: string;
  city: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  district: string;
  note: string;
  paymentMethodId: string;
  shippingMethodId: string;
  ward: string;
};

type CheckoutOption = {
  active?: boolean;
  description?: string;
  fee?: number | string;
  id?: string;
  name?: string;
  type?: string;
};

type CouponState = {
  code?: string;
  discountAmount?: number | string;
  freeShipping?: boolean;
  message?: string;
  totalAfterDiscount?: number | string;
  valid?: boolean;
};

const defaultForm: CheckoutForm = {
  address: "",
  city: "",
  customerEmail: "",
  customerName: "",
  customerPhone: "",
  district: "",
  note: "",
  paymentMethodId: "COD",
  shippingMethodId: "standard",
  ward: "",
};

const fallbackShippingMethods: CheckoutOption[] = [
  { description: "Giao trong 2-5 ngay lam viec.", fee: 30000, id: "standard", name: "Giao hang tieu chuan" },
];

const fallbackPaymentMethods: CheckoutOption[] = [
  { description: "Thanh toan cho don vi van chuyen khi nhan hang.", id: "COD", name: "Thanh toan khi nhan hang", type: "COD" },
  { description: "Shop se lien he de xac nhan thong tin chuyen khoan.", id: "BANK_TRANSFER", name: "Chuyen khoan ngan hang", type: "BANK_TRANSFER" },
];

function profileToForm(profile: User): Partial<CheckoutForm> {
  return {
    address: profile.address ?? "",
    city: profile.city ?? "",
    customerEmail: profile.email ?? "",
    customerName: profile.fullName || profile.username || "",
    customerPhone: profile.phone ?? "",
    district: profile.district ?? "",
    ward: profile.ward ?? "",
  };
}

function optionId(option: CheckoutOption | undefined) {
  return option?.id || option?.type || "";
}

export default function CheckoutPage() {
  const cart = useCart();
  const { notify } = useToast();
  const [form, setForm] = useState<CheckoutForm>(defaultForm);
  const [profile, setProfile] = useState<User | null>(null);
  const [shippingMethods, setShippingMethods] = useState<CheckoutOption[]>(fallbackShippingMethods);
  const [paymentMethods, setPaymentMethods] = useState<CheckoutOption[]>(fallbackPaymentMethods);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);

    Promise.allSettled([
      storefrontApi.shippingMethods(),
      storefrontApi.paymentMethods(),
      token ? accountApi.getProfile({ token }) : Promise.resolve(null),
    ]).then(([shippingResult, paymentResult, profileResult]) => {
      if (shippingResult.status === "fulfilled" && Array.isArray(shippingResult.value) && shippingResult.value.length) {
        const activeShipping = (shippingResult.value as CheckoutOption[]).filter((item) => item.active !== false);
        setShippingMethods(activeShipping.length ? activeShipping : fallbackShippingMethods);
      }
      if (paymentResult.status === "fulfilled" && Array.isArray(paymentResult.value) && paymentResult.value.length) {
        const activePayments = (paymentResult.value as CheckoutOption[]).filter((item) => item.active !== false);
        setPaymentMethods(activePayments.length ? activePayments : fallbackPaymentMethods);
      }
      if (profileResult.status === "fulfilled" && profileResult.value) {
        setProfile(profileResult.value);
        setForm((current) => ({ ...current, ...profileToForm(profileResult.value as User) }));
      }
      setIsLoadingProfile(false);
    });
  }, []);

  const selectedShipping = shippingMethods.find((item) => optionId(item) === form.shippingMethodId) ?? shippingMethods[0];
  const selectedPayment = paymentMethods.find((item) => optionId(item) === form.paymentMethodId) ?? paymentMethods[0];
  const baseShippingFee = Number(selectedShipping?.fee ?? 30000);
  const discountAmount = coupon?.valid ? Math.min(Number(coupon.discountAmount ?? 0), cart.total) : 0;
  const hasFreeShipping = Boolean(coupon?.valid && coupon.freeShipping);
  const shippingFee = hasFreeShipping || cart.total >= 1000000 || cart.items.length === 0 ? 0 : baseShippingFee;
  const grandTotal = Math.max(cart.total - discountAmount, 0) + shippingFee;
  const deliveryAddress = useMemo(
    () => [form.address, form.ward, form.district, form.city].map((item) => item.trim()).filter(Boolean).join(", "),
    [form.address, form.city, form.district, form.ward],
  );
  const canSubmit = Boolean(cart.items.length > 0 && form.customerName.trim() && form.customerPhone.trim() && deliveryAddress);

  function updateField(key: keyof CheckoutForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function applyCoupon() {
    const code = couponCode.trim();
    if (!code) {
      setCoupon(null);
      notify({ message: "Nhap ma giam gia truoc khi ap dung.", title: "Thieu ma giam gia", type: "info" });
      return;
    }
    if (!cart.items.length) {
      notify({ message: "Gio hang dang trong nen chua the ap dung ma.", title: "Chua co san pham", type: "error" });
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await storefrontApi.validateCoupon({
        code,
        customerId: profile?.id,
        subtotal: cart.total,
      }) as CouponState;
      setCoupon(result);
      if (result.valid) {
        setCouponCode(result.code || code);
        notify({ message: `Da ap dung ${result.code || code}.`, title: "Ma giam gia hop le", type: "success" });
      } else {
        notify({ message: result.message || "Ma giam gia khong hop le.", title: "Khong the ap dung ma", type: "error" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Khong the kiem tra ma giam gia.";
      setCoupon(null);
      notify({ message, title: "Kiem tra ma that bai", type: "error" });
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponCode("");
  }

  function validateCheckout() {
    if (!cart.items.length) {
      return "Gio hang dang trong.";
    }
    if (!form.customerName.trim()) {
      return "Vui lòng nhập tên người nhận.";
    }
    if (!form.customerPhone.trim() || form.customerPhone.trim().length < 9) {
      return "So dien thoai can toi thieu 9 ky tu.";
    }
    if (!deliveryAddress) {
      return "Vui lòng nhập địa chỉ giao hàng.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateCheckout();
    if (validationError) {
      notify({ message: validationError, title: "Thông tin chưa đầy đủ", type: "error" });
      return;
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const payload: CreateOrderPayload = {
      customerEmail: form.customerEmail.trim() || undefined,
      customerId: profile?.id,
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      deliveryAddress,
      couponCode: coupon?.valid ? coupon.code || couponCode.trim() : undefined,
      discountTotal: discountAmount,
      items: cart.items.map((item) => ({
        discount: 0,
        price: Number(item.product.price ?? 0),
        productId: item.product.id,
        productImageUrl: item.product.imageUrl,
        productName: item.product.name,
        quantity: item.quantity,
        sku: item.product.sku,
        unitPrice: Number(item.product.price ?? 0),
      })),
      note: form.note.trim() || undefined,
        paymentMethodId: optionId(selectedPayment),
      shippingFee,
      shippingMethodId: optionId(selectedShipping),
      taxTotal: 0,
    };

    setIsSubmitting(true);
    try {
      const result = await ordersApi.create(payload, { token });
      setCreatedOrder(result);
      cart.clear();
      notify({
        message: `Đơn hàng ${result.orderCode || `#${result.id}`} đã được tạo thành công.`,
        title: "Đặt hàng thành công",
        type: "success",
      });
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : "Không thể tạo đơn hàng.",
        title: "Đặt hàng thất bại",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase text-rose-700">Checkout</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Thanh toan</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Kiem tra thong tin nhan hang, phuong thuc giao hang va tom tat don truoc khi xac nhan.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-stone-600 sm:w-[420px]">
            <Step active icon={UserRound} label="Thong tin" />
            <Step active={Boolean(deliveryAddress)} icon={Truck} label="Giao hang" />
            <Step active={Boolean(createdOrder)} icon={CheckCircle2} label="Hoan tat" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
        <div className="space-y-6">
          {createdOrder ? (
            <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
              <CardContent className="p-6 text-emerald-900">
                <CheckCircle2 className="h-11 w-11" />
                <h2 className="mt-4 text-xl font-semibold">Dat hang thanh cong</h2>
                <p className="mt-2 text-sm leading-6">
                  Ma don hang: <span className="font-semibold">{createdOrder.orderCode || `#${createdOrder.id}`}</span>. Shop se xac nhan va cap nhat trang thai giao hang som.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/payment-status/${createdOrder.id}`}>Theo doi thanh toan</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/orders">Xem don hang</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle>Thong tin nhan hang</CardTitle>
              <CardDescription>
                {isLoadingProfile ? "Dang kiem tra ho so tai khoan." : profile ? "Da tu dong dien tu ho so cua ban." : "Dang nhap de tu dong dien thong tin giao hang lan sau."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form className="grid gap-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <CheckoutField icon={UserRound} label="Ho ten nguoi nhan">
                    <Input value={form.customerName} onChange={(event) => updateField("customerName", event.target.value)} placeholder="Nguyen Van A" required />
                  </CheckoutField>
                  <CheckoutField icon={Phone} label="So dien thoai">
                    <Input inputMode="tel" value={form.customerPhone} onChange={(event) => updateField("customerPhone", event.target.value)} placeholder="0900 000 000" required />
                  </CheckoutField>
                  <CheckoutField icon={UserRound} label="Email">
                    <Input type="email" value={form.customerEmail} onChange={(event) => updateField("customerEmail", event.target.value)} placeholder="you@example.com" />
                  </CheckoutField>
                  <CheckoutField icon={MapPin} label="Tinh / Thanh pho">
                    <Input value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="TP. Ho Chi Minh" />
                  </CheckoutField>
                  <CheckoutField icon={MapPin} label="Quan / Huyen">
                    <Input value={form.district} onChange={(event) => updateField("district", event.target.value)} placeholder="Quan 1" />
                  </CheckoutField>
                  <CheckoutField icon={MapPin} label="Phuong / Xa">
                    <Input value={form.ward} onChange={(event) => updateField("ward", event.target.value)} placeholder="Ben Nghe" />
                  </CheckoutField>
                  <div className="md:col-span-2">
                    <CheckoutField icon={MapPin} label="Dia chi chi tiet">
                      <Input value={form.address} onChange={(event) => updateField("address", event.target.value)} placeholder="So nha, ten duong" required />
                    </CheckoutField>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <CheckoutField icon={Truck} label="Phuong thuc giao hang">
                    <Select value={form.shippingMethodId} onChange={(event) => updateField("shippingMethodId", event.target.value)}>
                      {shippingMethods.map((item) => (
                        <option key={optionId(item)} value={optionId(item)}>
                          {item.name || optionId(item)} {Number(item.fee ?? 0) > 0 ? `- ${formatMoney(item.fee)}` : ""}
                        </option>
                      ))}
                    </Select>
                  </CheckoutField>
                  <CheckoutField icon={CreditCard} label="Phuong thuc thanh toan">
                    <Select value={form.paymentMethodId} onChange={(event) => updateField("paymentMethodId", event.target.value)}>
                      {paymentMethods.map((item) => (
                        <option key={optionId(item)} value={optionId(item)}>
                          {item.name || optionId(item)}
                        </option>
                      ))}
                    </Select>
                  </CheckoutField>
                </div>

                <label className="block text-sm font-semibold text-stone-800">
                  Ghi chu don hang
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    value={form.note}
                    onChange={(event) => updateField("note", event.target.value)}
                    placeholder="Vi du: giao sau 18h, goi truoc khi giao"
                  />
                </label>

                <div className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
                  <div className="flex gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    <span>Thong tin cua ban chi dung de xu ly don hang va giao hang.</span>
                  </div>
                </div>

                <Button className="w-full" disabled={!canSubmit || isSubmitting || Boolean(createdOrder)} type="submit">
                  {isSubmitting ? "Dang tao don..." : "Xac nhan dat hang"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="h-fit">
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Tom tat don hang
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {cart.items.length === 0 && !createdOrder ? (
                <div className="text-sm text-stone-600">
                  Gio hang trong.{" "}
                  <Link href="/products" className="font-medium text-stone-950 hover:underline">
                    Chon san pham
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="grid grid-cols-[64px_1fr] gap-3">
                      <SafeImage alt={item.product.name} className="h-16 rounded-md border border-stone-200" sizes="64px" src={item.product.imageUrl} />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-stone-950">{item.product.name}</p>
                        <p className="mt-1 text-xs text-stone-500">x{item.quantity}</p>
                        <p className="mt-1 text-sm font-semibold">{formatMoney(Number(item.product.price ?? 0) * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
                      <TicketPercent className="h-4 w-4 text-emerald-700" />
                      Ma giam gia
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        className="uppercase"
                        disabled={isApplyingCoupon || Boolean(createdOrder)}
                        placeholder="Nhap coupon"
                        value={couponCode}
                        onChange={(event) => {
                          setCouponCode(event.target.value);
                          if (coupon) {
                            setCoupon(null);
                          }
                        }}
                      />
                      {coupon?.valid ? (
                        <Button aria-label="Bo ma giam gia" size="icon" type="button" variant="outline" onClick={removeCoupon}>
                          <X className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button disabled={isApplyingCoupon || Boolean(createdOrder)} type="button" variant="outline" onClick={applyCoupon}>
                          {isApplyingCoupon ? "Dang kiem..." : "Ap dung"}
                        </Button>
                      )}
                    </div>
                    {coupon ? (
                      <p className={`mt-2 text-xs leading-5 ${coupon.valid ? "text-emerald-700" : "text-rose-700"}`}>
                        {coupon.valid
                          ? `Da giam ${formatMoney(discountAmount)}${coupon.freeShipping ? " va mien phi van chuyen" : ""}.`
                          : coupon.message || "Ma giam gia khong hop le."}
                      </p>
                    ) : null}
                  </div>
                  <PriceLine label="Tam tinh" value={formatMoney(cart.total)} />
                  {discountAmount > 0 ? <PriceLine label="Giam gia" value={`-${formatMoney(discountAmount)}`} /> : null}
                  <PriceLine label="Phi van chuyen" value={shippingFee === 0 ? "Mien phi" : formatMoney(shippingFee)} />
                  <div className="border-t border-stone-200 pt-3">
                    <PriceLine strong label="Tong cong" value={formatMoney(grandTotal)} />
                    <p className="mt-2 text-xs leading-5 text-stone-500">Mien phi van chuyen cho don tu 1.000.000 VND.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white shadow-sm">
            <CardContent className="space-y-3 p-5 text-sm text-stone-600">
              <div className="flex gap-3">
                <PackageCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-stone-950">Xu ly nhanh</p>
                  <p className="mt-1 leading-6">Don hang moi se vao trang thai NEW de shop xac nhan ton kho va lien he giao hang.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      <StoreFooter />
    </main>
  );
}

function CheckoutField({
  children,
  icon: Icon,
  label,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <label className="block text-sm font-semibold text-stone-800">
      <span className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-stone-500" />
        {label}
      </span>
      {children}
    </label>
  );
}

function PriceLine({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "text-lg font-semibold text-stone-950" : "text-sm text-stone-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Step({ active, icon: Icon, label }: { active: boolean; icon: LucideIcon; label: string }) {
  return (
    <div className={`rounded-md border px-3 py-2 ${active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-stone-200 bg-stone-50 text-stone-500"}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );
}
