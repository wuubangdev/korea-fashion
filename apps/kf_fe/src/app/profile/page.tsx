"use client";

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
  Package,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthSession } from "@/lib/auth";
import { formatMoney } from "@/lib/format";

type JwtPayload = {
  exp?: number;
  iat?: number;
  roles?: string[];
  sub?: string;
};

type SessionState = {
  payload: JwtPayload | null;
  token: string | null;
  username: string;
};

const DEFAULT_SESSION: SessionState = {
  payload: null,
  token: null,
  username: "",
};

function parseJwtPayload(token: string | null): JwtPayload | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(window.atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

function formatTokenDate(value?: number) {
  if (!value) {
    return "Khong ro";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value * 1000));
}

function getInitials(username: string) {
  const safeName = username.trim();
  if (!safeName) {
    return "KF";
  }

  return safeName.slice(0, 2).toUpperCase();
}

function formatRole(role: string) {
  return role.replace(/^ROLE_/, "").replace(/_/g, " ").toLowerCase();
}

export default function ProfilePage() {
  const cart = useCart();
  const [session, setSession] = useState<SessionState>(DEFAULT_SESSION);
  const [now, setNow] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
      const username = window.localStorage.getItem(AUTH_USER_KEY) || "";
      setSession({
        payload: parseJwtPayload(token),
        token,
        username,
      });
      setNow(Date.now());
    });
  }, []);

  const isLoggedIn = Boolean(session.token);
  const isExpired = Boolean(now && session.payload?.exp && session.payload.exp * 1000 <= now);
  const accountName = session.username || session.payload?.sub || "Khach hang";
  const roles = session.payload?.roles?.length ? session.payload.roles : [];
  const hasAdminRole = roles.some((role) => role === "ADMIN" || role === "ROLE_ADMIN");
  const visibleCartItems = cart.items.slice(0, 3);

  const profileStats = useMemo(
    () => [
      {
        icon: CheckCircle2,
        label: "Trang thai",
        value: isLoggedIn && !isExpired ? "Dang dang nhap" : isExpired ? "Phien het han" : "Chua dang nhap",
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

  const handleLogout = () => {
    clearAuthSession();
    setSession(DEFAULT_SESSION);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />

      <main>
        <section className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-900 text-2xl font-semibold text-white shadow-sm">
                {getInitials(accountName)}
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant={isLoggedIn && !isExpired ? "default" : "secondary"}>
                    {isLoggedIn && !isExpired ? "Tai khoan hoat dong" : "Khach"}
                  </Badge>
                  {roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {formatRole(role)}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">{accountName}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                  Quan ly thong tin dang nhap, trang thai phien va cac tac vu mua sam cua ban.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isLoggedIn ? (
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Dang xuat
                </Button>
              ) : (
                <>
                  <Button asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Dang nhap
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/register">Dang ky</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserRound className="h-5 w-5" />
                  Ho so tai khoan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-md border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase text-stone-500">Ten dang nhap</p>
                    <p className="mt-2 text-base font-semibold text-stone-950">{accountName}</p>
                  </div>
                  <div className="rounded-md border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase text-stone-500">Quyen truy cap</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {roles.length ? (
                        roles.map((role) => (
                          <Badge key={role} variant="secondary" className="capitalize">
                            {formatRole(role)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-stone-600">Chua co thong tin</span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-md border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase text-stone-500">Ngay tao phien</p>
                    <p className="mt-2 text-sm font-medium text-stone-800">{formatTokenDate(session.payload?.iat)}</p>
                  </div>
                  <div className="rounded-md border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase text-stone-500">Het han phien</p>
                    <p className="mt-2 text-sm font-medium text-stone-800">{formatTokenDate(session.payload?.exp)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingBag className="h-5 w-5" />
                  Gio hang gan day
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visibleCartItems.length ? (
                  <div className="divide-y divide-stone-200">
                    {visibleCartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
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
                  <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
                    Gio hang dang trong.
                  </div>
                )}
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
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Xem san pham
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/cart">
                    <WalletCards className="mr-2 h-4 w-4" />
                    Mo gio hang
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Don hang cua toi
                  </Link>
                </Button>
                {hasAdminRole ? (
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Quan tri
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-stone-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarClock className="h-5 w-5" />
                  Phien dang nhap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-md bg-stone-100 p-4">
                  <Clock3 className="mt-0.5 h-5 w-5 text-stone-600" />
                  <div>
                    <p className="font-medium text-stone-950">
                      {isLoggedIn && !isExpired ? "Phien dang hop le" : isExpired ? "Can dang nhap lai" : "Chua co phien"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      {isLoggedIn
                        ? `Het han: ${formatTokenDate(session.payload?.exp)}`
                        : "Dang nhap de dong bo don hang va thong tin tai khoan."}
                    </p>
                  </div>
                </div>
                {!isLoggedIn ? (
                  <Button asChild className="w-full">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Dang nhap ngay
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
