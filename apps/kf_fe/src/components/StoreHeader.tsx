"use client";

import { ChevronDown, Heart, LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthSession } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import type { Category, PageResult, Product } from "@/types/api";

type Collection<T> = PageResult<T> | T[] | null;

type SessionState = {
  token: string | null;
  username: string;
};

const staticNavItems = [
  { href: "/policies", label: "Chính sách" },
  { href: "/contact", label: "Liên hệ" },
];

function getItems<T>(data: Collection<T>) {
  if (!data) {
    return [];
  }

  return Array.isArray(data) ? data : data.content ?? [];
}

function getCategoryHref(category: Category) {
  return `/products?categoryId=${encodeURIComponent(String(category.id))}`;
}

function getBrandHref(brand: string) {
  return `/products?brand=${encodeURIComponent(brand)}`;
}

function getInitials(username: string) {
  const safeName = username.trim();
  return safeName ? safeName.slice(0, 2).toUpperCase() : "KF";
}

export function StoreHeader() {
  const cart = useCart();
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<SessionState>({ token: null, username: "" });

  const categoriesResource = useApiResource<Collection<Category>>({
    path: "/api/storefront/categories",
  });
  const productsResource = useApiResource<Collection<Product>>({
    path: "/api/products",
    query: { page: 0, size: 100, sort: "brand,asc" },
  });

  const categories = useMemo(
    () => getItems(categoriesResource.data).filter((item) => item.active !== false).slice(0, 10),
    [categoriesResource.data],
  );
  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          getItems(productsResource.data)
            .map((item) => item.brand?.trim())
            .filter((brand): brand is string => Boolean(brand)),
        ),
      ).slice(0, 10),
    [productsResource.data],
  );
  const isLoggedIn = Boolean(session.token);
  const accountName = session.username || "Tài khoản";

  useEffect(() => {
    function syncSession() {
      setSession({
        token: window.localStorage.getItem(AUTH_TOKEN_KEY),
        username: window.localStorage.getItem(AUTH_USER_KEY) || "",
      });
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("auth:update", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("auth:update", syncSession);
    };
  }, []);

  function handleLogout() {
    clearAuthSession();
    setSession({ token: null, username: "" });
    setIsOpen(false);
    window.dispatchEvent(new Event("auth:update"));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 shadow-sm shadow-stone-950/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-normal text-stone-950">{settings.siteName}</span>
            <span className="hidden truncate text-xs font-medium uppercase text-rose-700 sm:block">Seoul everyday wear</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-stone-600 md:flex">
          <div className="group relative">
            <Link href="/products" className="link-hover inline-flex items-center gap-1 py-2 transition hover:text-stone-950">
              Sản phẩm
              <ChevronDown aria-hidden className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div className="dropdown-panel invisible absolute left-0 top-full w-64 translate-y-3 scale-[0.96] rounded-md border border-stone-200 bg-white/95 p-2 opacity-0 shadow-xl shadow-stone-950/10 backdrop-blur transition group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
              <Link href="/products" className="dropdown-item block rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950">
                Tất cả sản phẩm
              </Link>
              {categories.length ? (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={getCategoryHref(category)}
                    className="dropdown-item block rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <span className="block px-3 py-2 text-stone-400">Chưa có danh mục</span>
              )}
            </div>
          </div>

          <div className="group relative">
            <Link href="/products" className="link-hover inline-flex items-center gap-1 py-2 transition hover:text-stone-950">
              Thương hiệu
              <ChevronDown aria-hidden className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div className="dropdown-panel invisible absolute left-0 top-full w-60 translate-y-3 scale-[0.96] rounded-md border border-stone-200 bg-white/95 p-2 opacity-0 shadow-xl shadow-stone-950/10 backdrop-blur transition group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
              {brands.length ? (
                brands.map((brand) => (
                  <Link
                    key={brand}
                    href={getBrandHref(brand)}
                    className="dropdown-item block rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                  >
                    {brand}
                  </Link>
                ))
              ) : (
                <span className="block px-3 py-2 text-stone-400">Chưa có thương hiệu</span>
              )}
            </div>
          </div>

          {staticNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="link-hover transition hover:text-stone-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden sm:inline-flex" variant="ghost" size="icon" aria-label="Tìm sản phẩm" disabled>
            <Search aria-hidden className="h-4 w-4" />
          </Button>

          {isLoggedIn ? (
            <div className="group relative">
              <Button variant="ghost" size="icon" aria-label={`Tài khoản ${accountName}`}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[11px] font-semibold text-white">
                  {getInitials(accountName)}
                </span>
              </Button>
              <div className="dropdown-panel invisible absolute right-0 top-full w-56 translate-y-3 scale-[0.96] rounded-md border border-stone-200 bg-white/95 p-2 opacity-0 shadow-xl shadow-stone-950/10 backdrop-blur transition group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
                <div className="border-b border-stone-100 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-stone-950">{accountName}</p>
                  <p className="mt-0.5 text-xs text-stone-500">Đang đăng nhập</p>
                </div>
                <Link href="/profile" className="dropdown-item mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-950">
                  <UserRound aria-hidden className="h-4 w-4" />
                  Thông tin tài khoản
                </Link>
                <Link href="/wishlist" className="dropdown-item flex items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-950">
                  <Heart aria-hidden className="h-4 w-4" />
                  Danh sách yêu thích
                </Link>
                <button
                  className="dropdown-item flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut aria-hidden className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" aria-label="Đăng nhập">
                <UserRound aria-hidden className="h-4 w-4" />
              </Button>
            </Link>
          )}

          <div className="group relative">
            <Link href="/cart" className="relative block">
              <Button variant="outline" size="icon" aria-label={`Giỏ hàng có ${cart.count} sản phẩm`}>
                <ShoppingBag aria-hidden className="h-4 w-4" />
              </Button>
              {cart.count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold leading-none text-white">
                  {cart.count > 99 ? "99+" : cart.count}
                </span>
              ) : null}
            </Link>
            <MiniCart />
          </div>

          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            aria-label="Mở menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X aria-hidden className="h-4 w-4" /> : <Menu aria-hidden className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isOpen ? (
        <div className="animate-in border-t border-stone-200 bg-white px-4 py-3 shadow-lg shadow-stone-950/5 md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 text-sm font-medium text-stone-700">
            <Link href="/products" className="rounded-md px-3 py-2 hover:bg-stone-100" onClick={() => setIsOpen(false)}>
              Tất cả sản phẩm
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={getCategoryHref(category)}
                className="rounded-md px-6 py-2 text-stone-600 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            {brands.map((brand) => (
              <Link
                key={brand}
                href={getBrandHref(brand)}
                className="rounded-md px-3 py-2 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                Thương hiệu: {brand}
              </Link>
            ))}
            {staticNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function MiniCart() {
  const cart = useCart();
  const visibleItems = cart.items;

  return (
    <div className="dropdown-panel invisible absolute right-0 top-full z-50 mt-2 w-[min(360px,calc(100vw-2rem))] translate-y-3 scale-[0.96] overflow-hidden rounded-lg border border-stone-200 bg-white/98 opacity-0 shadow-2xl shadow-stone-950/15 backdrop-blur transition group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-stone-950">Giỏ hàng</div>
          <div className="mt-0.5 text-xs text-stone-500">{cart.count} sản phẩm</div>
        </div>
        <Link href="/cart" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
          Xem giỏ
        </Link>
      </div>

      {visibleItems.length ? (
        <>
          <div className="max-h-80 overflow-y-auto p-2">
            {visibleItems.map((item) => (
              <Link
                key={item.product.id}
                href={`/products/${item.product.id}`}
                className="grid grid-cols-[56px_1fr] gap-3 rounded-md p-2 transition hover:bg-stone-50"
              >
                <SafeImage
                  alt={item.product.name}
                  className="h-14 w-14 rounded-md"
                  sizes="56px"
                  src={item.product.imageUrl}
                />
                <span className="min-w-0">
                  <span className="line-clamp-1 block text-sm font-semibold text-stone-950">{item.product.name}</span>
                  <span className="mt-1 flex items-center justify-between gap-2 text-xs text-stone-500">
                    <span>x{item.quantity}</span>
                    <span className="font-semibold text-stone-800">{formatMoney(Number(item.product.price ?? 0) * item.quantity)}</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="border-t border-stone-100 p-3">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-stone-500">Tạm tính</span>
              <span className="font-semibold text-stone-950">{formatMoney(cart.total)}</span>
            </div>
            <Button asChild className="w-full">
              <Link href="/checkout">Thanh toán</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="p-6 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-3 text-sm font-semibold text-stone-950">Giỏ hàng đang trống</p>
          <p className="mt-1 text-sm leading-6 text-stone-500">Thêm sản phẩm yêu thích để xem nhanh tại đây.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/products">Xem sản phẩm</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
