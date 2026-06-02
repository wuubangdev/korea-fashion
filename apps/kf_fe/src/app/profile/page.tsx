"use client";

import {
  Camera,
  CheckCircle2,
  Home,
  KeyRound,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { SafeImage } from "@/components/SafeImage";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { useToast } from "@/components/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { accountApi, mediaApi } from "@/lib/api";
import { AUTH_AVATAR_KEY, AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthSession } from "@/lib/auth";
import { hasAdminAccessRole, parseJwtPayload, type JwtPayload } from "@/lib/authRoles";
import { formatMoney } from "@/lib/format";
import type { UpdateProfilePayload, User } from "@/types/api";

type SessionState = {
  payload: JwtPayload | null;
  token: string | null;
  username: string;
};

type PasswordForm = {
  currentPassword: string;
  confirmPassword: string;
  newPassword: string;
};

type ProfileForm = UpdateProfilePayload & {
  avatarUrl?: string;
};

const emptyProfile: ProfileForm = {
  address: "",
  avatarUrl: "",
  city: "",
  district: "",
  email: "",
  fullName: "",
  phone: "",
  ward: "",
};

const emptyPassword: PasswordForm = {
  confirmPassword: "",
  currentPassword: "",
  newPassword: "",
};

const defaultSession: SessionState = {
  payload: null,
  token: null,
  username: "",
};

function getInitials(name: string) {
  const safeName = name.trim();
  return safeName ? safeName.slice(0, 2).toUpperCase() : "KF";
}

function formatRole(role: string) {
  const normalized = role.replace(/^ROLE_/, "").toUpperCase();
  const labels: Record<string, string> = {
    ADMIN: "Quản trị viên",
    CUSTOMER: "Khách hàng",
    MANAGER: "Quản lý",
    STAFF: "Nhân viên",
    USER: "Người dùng",
  };
  return labels[normalized] ?? normalized.replace(/_/g, " ").toLowerCase();
}

function toProfileForm(user: User | null): ProfileForm {
  return {
    address: user?.address ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    city: user?.city ?? "",
    district: user?.district ?? "",
    email: user?.email ?? "",
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    ward: user?.ward ?? "",
  };
}

export default function ProfilePage() {
  const cart = useCart();
  const { notify } = useToast();
  const [session, setSession] = useState<SessionState>(defaultSession);
  const [profile, setProfile] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(emptyPassword);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
      const username = window.localStorage.getItem(AUTH_USER_KEY) || "";
      setSession({ payload: parseJwtPayload(token), token, username });

      if (!token) {
        setIsLoadingProfile(false);
        return;
      }

      accountApi.getProfile({ token })
        .then((result) => {
          setProfile(result);
          setForm(toProfileForm(result));
          if (result.username) {
            window.localStorage.setItem(AUTH_USER_KEY, result.username);
          }
          if (result.avatarUrl) {
            window.localStorage.setItem(AUTH_AVATAR_KEY, result.avatarUrl);
          } else {
            window.localStorage.removeItem(AUTH_AVATAR_KEY);
          }
        })
        .catch((error) => {
          notify({
            message: error instanceof Error ? error.message : "Không thể tải thông tin tài khoản.",
            title: "Không tải được hồ sơ",
            type: "error",
          });
        })
        .finally(() => setIsLoadingProfile(false));
    });
  }, [notify]);

  const isLoggedIn = Boolean(session.token);
  const isExpired = Boolean(session.payload?.exp && session.payload.exp * 1000 <= Date.now());
  const roles = profile?.roles?.length ? profile.roles : session.payload?.roles ?? [];
  const hasAdminRole = hasAdminAccessRole(roles);
  const displayName = form.fullName || profile?.username || session.username || session.payload?.sub || "Khách hàng";
  const accountName = profile?.username || session.username || session.payload?.sub || "Tài khoản";
  const visibleCartItems = cart.items.slice(0, 3);

  const profileStats = useMemo(
    () => [
      {
        icon: CheckCircle2,
        label: "Trạng thái",
        value: isLoggedIn && !isExpired ? "Đang hoạt động" : isExpired ? "Phiên hết hạn" : "Chưa đăng nhập",
      },
      {
        icon: ShoppingBag,
        label: "Giỏ hàng",
        value: `${cart.count} sản phẩm`,
      },
      {
        icon: WalletCards,
        label: "Tạm tính",
        value: formatMoney(cart.total),
      },
    ],
    [cart.count, cart.total, isExpired, isLoggedIn],
  );

  function updateField(key: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updatePasswordField(key: keyof PasswordForm, value: string) {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  }

  function persistAvatarUrl(avatarUrl?: string | null) {
    if (avatarUrl) {
      window.localStorage.setItem(AUTH_AVATAR_KEY, avatarUrl);
    } else {
      window.localStorage.removeItem(AUTH_AVATAR_KEY);
    }
    window.dispatchEvent(new Event("auth:update"));
  }

  async function handleAvatarUpload(file: File | undefined) {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!file || !token) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      notify({ message: "Vui lòng chọn file hình ảnh.", title: "File chưa hợp lệ", type: "error" });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const uploaded = await mediaApi.upload(file, "avatars", file.name, { token });
      if (!uploaded.url) {
        throw new Error("Upload thành công nhưng backend không trả về URL ảnh.");
      }
      const saved = await accountApi.updateAvatar({ avatarUrl: uploaded.url }, { token });
      const nextAvatarUrl = saved.avatarUrl || uploaded.url;
      const nextProfile = { ...saved, avatarUrl: nextAvatarUrl };
      setProfile(nextProfile);
      setForm(toProfileForm(nextProfile));
      persistAvatarUrl(nextAvatarUrl);
      notify({ message: "Ảnh đại diện mới đã được cập nhật.", title: "Đã đổi ảnh", type: "success" });
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : "Không thể cập nhật ảnh đại diện.",
        title: "Đổi ảnh thất bại",
        type: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      notify({ message: "Vui lòng đăng nhập để cập nhật hồ sơ.", title: "Cần đăng nhập", type: "info" });
      return;
    }

    setIsSavingProfile(true);
    try {
      const profilePayload: UpdateProfilePayload = {
        address: form.address,
        city: form.city,
        district: form.district,
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
        ward: form.ward,
      };
      const saved = await accountApi.updateProfile(profilePayload, { token });
      setProfile(saved);
      setForm(toProfileForm(saved));
      persistAvatarUrl(saved.avatarUrl);
      notify({ message: "Thông tin tài khoản đã được cập nhật.", title: "Đã lưu hồ sơ", type: "success" });
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : "Không thể cập nhật hồ sơ.",
        title: "Lưu hồ sơ thất bại",
        type: "error",
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      notify({ message: "Vui lòng đăng nhập để đổi mật khẩu.", title: "Cần đăng nhập", type: "info" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      notify({ message: "Mật khẩu mới cần tối thiểu 6 ký tự.", title: "Mật khẩu quá ngắn", type: "error" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify({ message: "Xác nhận mật khẩu không khớp.", title: "Kiểm tra lại mật khẩu", type: "error" });
      return;
    }

    setIsChangingPassword(true);
    try {
      await accountApi.changePassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { token },
      );
      setPasswordForm(emptyPassword);
      setIsPasswordFormOpen(false);
      notify({ message: "Mật khẩu đã được cập nhật.", title: "Đã đổi mật khẩu", type: "success" });
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : "Không thể đổi mật khẩu.",
        title: "Đổi mật khẩu thất bại",
        type: "error",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  const handleLogout = () => {
    clearAuthSession();
    setSession(defaultSession);
    setProfile(null);
    setForm(emptyProfile);
    notify({
      message: "Phiên đăng nhập đã được kết thúc.",
      title: "Đã đăng xuất",
      type: "success",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-950">
        <StoreHeader />
        <main className="mx-auto grid max-w-3xl place-items-center px-4 py-16 sm:px-6">
          <Card className="w-full border-stone-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <UserRound className="mx-auto h-12 w-12 text-stone-400" />
              <h1 className="mt-4 text-2xl font-semibold text-stone-950">Cần đăng nhập</h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Đăng nhập để cập nhật thông tin cá nhân, địa chỉ giao hàng, ảnh đại diện và mật khẩu.
              </p>
              <Button asChild className="mt-6">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />

      <main>
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-stone-200 bg-stone-950 shadow-sm">
                {form.avatarUrl ? (
                  <SafeImage alt={displayName} className="h-full w-full" imgClassName="object-cover" sizes="96px" src={form.avatarUrl} />
                ) : (
                  <div className="grid h-full w-full place-items-center text-2xl font-semibold text-white">
                    {getInitials(displayName)}
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant={isExpired ? "warning" : "default"}>
                    {isExpired ? "Phiên hết hạn" : "Tài khoản hoạt động"}
                  </Badge>
                  {roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {formatRole(role)}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">{displayName}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                  Cập nhật thông tin liên hệ, địa chỉ giao hàng, ảnh đại diện và bảo mật tài khoản.
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {profileStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="border-stone-200 shadow-sm">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-stone-100 text-stone-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase text-stone-500">{stat.label}</p>
                        <p className="mt-1 text-lg font-semibold text-stone-950">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="border-b border-stone-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserRound className="h-5 w-5" />
                  Hồ sơ cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {isLoadingProfile ? (
                  <div className="h-80 animate-pulse rounded-md bg-stone-100" />
                ) : (
                  <form className="grid gap-5" onSubmit={handleProfileSubmit}>
                    <div className="flex flex-col gap-4 rounded-md border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-stone-200 bg-stone-950">
                        {form.avatarUrl ? (
                          <SafeImage alt={displayName} className="h-full w-full" imgClassName="object-cover" sizes="80px" src={form.avatarUrl} />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-lg font-semibold text-white">
                            {getInitials(displayName)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-stone-950">Ảnh đại diện</p>
                        <p className="mt-1 text-sm leading-6 text-stone-600">
                          Nên dùng ảnh vuông, rõ mặt. Ảnh sẽ được cập nhật ngay sau khi tải lên thành công.
                        </p>
                      </div>
                      <Button asChild variant="outline">
                        <label className="cursor-pointer">
                          <Camera className="h-4 w-4" />
                          {isUploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
                          <input
                            className="sr-only"
                            type="file"
                            accept="image/*"
                            disabled={isUploadingAvatar}
                            onChange={(event) => {
                              void handleAvatarUpload(event.target.files?.[0]);
                              event.target.value = "";
                            }}
                          />
                        </label>
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <ProfileField icon={UserRound} label="Tên đăng nhập">
                        <Input value={accountName} disabled />
                      </ProfileField>
                      <ProfileField icon={UserRound} label="Họ và tên">
                        <Input value={form.fullName ?? ""} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Nguyễn Văn A" />
                      </ProfileField>
                      <ProfileField icon={Mail} label="Email">
                        <Input type="email" value={form.email ?? ""} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" />
                      </ProfileField>
                      <ProfileField icon={Phone} label="Số điện thoại">
                        <Input value={form.phone ?? ""} onChange={(event) => updateField("phone", event.target.value)} placeholder="0900 000 000" />
                      </ProfileField>
                      <ProfileField icon={MapPin} label="Tỉnh / Thành phố">
                        <Input value={form.city ?? ""} onChange={(event) => updateField("city", event.target.value)} placeholder="TP. Ho Chi Minh" />
                      </ProfileField>
                      <ProfileField icon={MapPin} label="Quận / Huyện">
                        <Input value={form.district ?? ""} onChange={(event) => updateField("district", event.target.value)} placeholder="Quận 1" />
                      </ProfileField>
                      <ProfileField icon={MapPin} label="Phường / Xã">
                        <Input value={form.ward ?? ""} onChange={(event) => updateField("ward", event.target.value)} placeholder="Bến Nghé" />
                      </ProfileField>
                      <ProfileField icon={Home} label="Địa chỉ chi tiết">
                        <Input value={form.address ?? ""} onChange={(event) => updateField("address", event.target.value)} placeholder="Số nhà, tên đường" />
                      </ProfileField>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSavingProfile || isUploadingAvatar}>
                        {isSavingProfile ? "Đang lưu..." : "Lưu hồ sơ"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="border-b border-stone-100">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <KeyRound className="h-5 w-5" />
                    Bảo mật tài khoản
                  </CardTitle>
                  {!isPasswordFormOpen ? (
                    <Button variant="outline" type="button" onClick={() => setIsPasswordFormOpen(true)}>
                      <KeyRound className="h-4 w-4" />
                      Đổi mật khẩu
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {!isPasswordFormOpen ? (
                  <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-sm leading-6 text-stone-600">
                    Mật khẩu hiện được ẩn để bảo vệ tài khoản. Chỉ mở form khi bạn muốn thay đổi mật khẩu.
                  </div>
                ) : (
                  <form className="grid gap-4 md:grid-cols-3" onSubmit={handlePasswordSubmit}>
                    <label className="block text-sm font-semibold text-stone-800">
                      Mật khẩu hiện tại
                      <Input className="mt-2" type="password" value={passwordForm.currentPassword} onChange={(event) => updatePasswordField("currentPassword", event.target.value)} />
                    </label>
                    <label className="block text-sm font-semibold text-stone-800">
                      Mật khẩu mới
                      <Input className="mt-2" type="password" value={passwordForm.newPassword} onChange={(event) => updatePasswordField("newPassword", event.target.value)} />
                    </label>
                    <label className="block text-sm font-semibold text-stone-800">
                      Xác nhận mật khẩu
                      <Input className="mt-2" type="password" value={passwordForm.confirmPassword} onChange={(event) => updatePasswordField("confirmPassword", event.target.value)} />
                    </label>
                    <div className="flex justify-end gap-2 md:col-span-3">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isChangingPassword}
                        onClick={() => {
                          setPasswordForm(emptyPassword);
                          setIsPasswordFormOpen(false);
                        }}
                      >
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? "Đang đổi..." : "Lưu mật khẩu mới"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="h-5 w-5" />
                  Tác vụ nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button asChild className="justify-start">
                  <Link href="/products">
                    <ShoppingBag className="h-4 w-4" />
                    Xem sản phẩm
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/cart">
                    <WalletCards className="h-4 w-4" />
                    Mở giỏ hàng
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/orders">
                    <Package className="h-4 w-4" />
                    Đơn hàng của tôi
                  </Link>
                </Button>
                {hasAdminRole ? (
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/admin">
                      <ShieldCheck className="h-4 w-4" />
                      Quản trị
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-stone-700">
                <InfoLine icon={Phone} label="Điện thoại" value={form.phone || "Chưa cập nhật"} />
                <InfoLine icon={Mail} label="Email" value={form.email || "Chưa cập nhật"} />
                <InfoLine
                  icon={MapPin}
                  label="Địa chỉ"
                  value={[form.address, form.ward, form.district, form.city].filter(Boolean).join(", ") || "Chưa cập nhật"}
                />
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Giỏ hàng gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                {visibleCartItems.length ? (
                  <div className="divide-y divide-stone-200">
                    {visibleCartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-stone-950">{item.product.name}</p>
                          <p className="mt-1 text-sm text-stone-500">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-stone-950">
                          {formatMoney(Number(item.product.price ?? 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
                    Giỏ hàng đang trống.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}

function ProfileField({
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

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-stone-200 bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-stone-500">{label}</p>
        <p className="mt-1 break-words font-medium text-stone-950">{value}</p>
      </div>
    </div>
  );
}
