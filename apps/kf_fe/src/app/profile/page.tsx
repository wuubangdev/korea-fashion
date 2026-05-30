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

const emptyProfile: UpdateProfilePayload = {
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
  return role.replace(/^ROLE_/, "").replace(/_/g, " ").toLowerCase();
}

function toProfileForm(user: User | null): UpdateProfilePayload {
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
  const [form, setForm] = useState<UpdateProfilePayload>(emptyProfile);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(emptyPassword);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
            message: error instanceof Error ? error.message : "Khong the tai thong tin tai khoan.",
            title: "Tai ho so that bai",
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
  const displayName = form.fullName || profile?.username || session.username || session.payload?.sub || "Khach hang";
  const accountName = profile?.username || session.username || session.payload?.sub || "Tai khoan";
  const visibleCartItems = cart.items.slice(0, 3);

  const profileStats = useMemo(
    () => [
      {
        icon: CheckCircle2,
        label: "Trang thai",
        value: isLoggedIn && !isExpired ? "Dang hoat dong" : isExpired ? "Phien het han" : "Chua dang nhap",
      },
      {
        icon: ShoppingBag,
        label: "Gio hang",
        value: `${cart.count} san pham`,
      },
      {
        icon: WalletCards,
        label: "Tam tinh",
        value: formatMoney(cart.total),
      },
    ],
    [cart.count, cart.total, isExpired, isLoggedIn],
  );

  function updateField(key: keyof UpdateProfilePayload, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updatePasswordField(key: keyof PasswordForm, value: string) {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  }

  async function handleAvatarUpload(file: File | undefined) {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!file || !token) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      notify({ message: "Vui long chon file hinh anh.", title: "File khong hop le", type: "error" });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const uploaded = await mediaApi.upload(file, "avatars", file.name, { token });
      updateField("avatarUrl", uploaded.url);
      notify({ message: "Anh dai dien da san sang, hay luu ho so de cap nhat.", title: "Da tai anh", type: "success" });
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : "Khong the tai anh dai dien.",
        title: "Tai anh that bai",
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
      notify({ message: "Vui long dang nhap de cap nhat ho so.", title: "Can dang nhap", type: "info" });
      return;
    }

    setIsSavingProfile(true);
    try {
      const saved = await accountApi.updateProfile(form, { token });
      setProfile(saved);
      setForm(toProfileForm(saved));
      if (saved.avatarUrl) {
        window.localStorage.setItem(AUTH_AVATAR_KEY, saved.avatarUrl);
      } else {
        window.localStorage.removeItem(AUTH_AVATAR_KEY);
      }
      window.dispatchEvent(new Event("auth:update"));
      notify({ message: "Thong tin tai khoan da duoc cap nhat.", title: "Da luu ho so", type: "success" });
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : "Khong the cap nhat ho so.",
        title: "Luu ho so that bai",
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
      notify({ message: "Vui long dang nhap de doi mat khau.", title: "Can dang nhap", type: "info" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      notify({ message: "Mat khau moi can toi thieu 6 ky tu.", title: "Mat khau qua ngan", type: "error" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify({ message: "Xac nhan mat khau khong khop.", title: "Kiem tra lai mat khau", type: "error" });
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
      notify({ message: "Mat khau da duoc cap nhat.", title: "Da doi mat khau", type: "success" });
    } catch (error) {
      notify({
        message: error instanceof Error ? error.message : "Khong the doi mat khau.",
        title: "Doi mat khau that bai",
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
      message: "Phien dang nhap da duoc ket thuc.",
      title: "Da dang xuat",
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
              <h1 className="mt-4 text-2xl font-semibold text-stone-950">Can dang nhap</h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Dang nhap de cap nhat thong tin ca nhan, dia chi giao hang, anh dai dien va mat khau.
              </p>
              <Button asChild className="mt-6">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Dang nhap
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
                    {isExpired ? "Phien het han" : "Tai khoan hoat dong"}
                  </Badge>
                  {roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {formatRole(role)}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">{displayName}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                  Cap nhat thong tin lien he, dia chi giao hang, anh dai dien va bao mat tai khoan.
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Dang xuat
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
                  Ho so ca nhan
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
                        <p className="text-sm font-semibold text-stone-950">Anh dai dien</p>
                        <p className="mt-1 text-sm leading-6 text-stone-600">
                          Nen dung anh vuong, ro mat. Anh se duoc luu sau khi bam luu ho so.
                        </p>
                      </div>
                      <Button asChild variant="outline">
                        <label className="cursor-pointer">
                          <Camera className="h-4 w-4" />
                          {isUploadingAvatar ? "Dang tai..." : "Doi anh"}
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
                      <ProfileField icon={UserRound} label="Ten dang nhap">
                        <Input value={accountName} disabled />
                      </ProfileField>
                      <ProfileField icon={UserRound} label="Ho va ten">
                        <Input value={form.fullName ?? ""} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Nguyen Van A" />
                      </ProfileField>
                      <ProfileField icon={Mail} label="Email">
                        <Input type="email" value={form.email ?? ""} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" />
                      </ProfileField>
                      <ProfileField icon={Phone} label="So dien thoai">
                        <Input value={form.phone ?? ""} onChange={(event) => updateField("phone", event.target.value)} placeholder="0900 000 000" />
                      </ProfileField>
                      <ProfileField icon={MapPin} label="Tinh / Thanh pho">
                        <Input value={form.city ?? ""} onChange={(event) => updateField("city", event.target.value)} placeholder="TP. Ho Chi Minh" />
                      </ProfileField>
                      <ProfileField icon={MapPin} label="Quan / Huyen">
                        <Input value={form.district ?? ""} onChange={(event) => updateField("district", event.target.value)} placeholder="Quan 1" />
                      </ProfileField>
                      <ProfileField icon={MapPin} label="Phuong / Xa">
                        <Input value={form.ward ?? ""} onChange={(event) => updateField("ward", event.target.value)} placeholder="Ben Nghe" />
                      </ProfileField>
                      <ProfileField icon={Home} label="Dia chi chi tiet">
                        <Input value={form.address ?? ""} onChange={(event) => updateField("address", event.target.value)} placeholder="So nha, ten duong" />
                      </ProfileField>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSavingProfile || isUploadingAvatar}>
                        {isSavingProfile ? "Dang luu..." : "Luu ho so"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="border-b border-stone-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <KeyRound className="h-5 w-5" />
                  Doi mat khau
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <form className="grid gap-4 md:grid-cols-3" onSubmit={handlePasswordSubmit}>
                  <label className="block text-sm font-semibold text-stone-800">
                    Mat khau hien tai
                    <Input className="mt-2" type="password" value={passwordForm.currentPassword} onChange={(event) => updatePasswordField("currentPassword", event.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold text-stone-800">
                    Mat khau moi
                    <Input className="mt-2" type="password" value={passwordForm.newPassword} onChange={(event) => updatePasswordField("newPassword", event.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold text-stone-800">
                    Xac nhan mat khau
                    <Input className="mt-2" type="password" value={passwordForm.confirmPassword} onChange={(event) => updatePasswordField("confirmPassword", event.target.value)} />
                  </label>
                  <div className="md:col-span-3 md:flex md:justify-end">
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Dang doi..." : "Doi mat khau"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="h-5 w-5" />
                  Tac vu nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button asChild className="justify-start">
                  <Link href="/products">
                    <ShoppingBag className="h-4 w-4" />
                    Xem san pham
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/cart">
                    <WalletCards className="h-4 w-4" />
                    Mo gio hang
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/orders">
                    <Package className="h-4 w-4" />
                    Don hang cua toi
                  </Link>
                </Button>
                {hasAdminRole ? (
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/admin">
                      <ShieldCheck className="h-4 w-4" />
                      Quan tri
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Thong tin giao hang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-stone-700">
                <InfoLine icon={Phone} label="Dien thoai" value={form.phone || "Chua cap nhat"} />
                <InfoLine icon={Mail} label="Email" value={form.email || "Chua cap nhat"} />
                <InfoLine
                  icon={MapPin}
                  label="Dia chi"
                  value={[form.address, form.ward, form.district, form.city].filter(Boolean).join(", ") || "Chua cap nhat"}
                />
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Gio hang gan day</CardTitle>
              </CardHeader>
              <CardContent>
                {visibleCartItems.length ? (
                  <div className="divide-y divide-stone-200">
                    {visibleCartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-stone-950">{item.product.name}</p>
                          <p className="mt-1 text-sm text-stone-500">So luong: {item.quantity}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-stone-950">
                          {formatMoney(Number(item.product.price ?? 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
                    Gio hang dang trong.
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
