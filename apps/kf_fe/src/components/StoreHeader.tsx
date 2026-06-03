"use client";

import { ChevronDown, Heart, LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { useToast } from "@/components/ToastProvider";
import { UserOrderBell } from "@/components/UserOrderBell";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { AUTH_AVATAR_KEY, AUTH_USER_KEY, clearAuthSession, getActiveAuthToken, getAuthTokenExpirationMs } from "@/lib/auth";
import { useLoginRedirectHref } from "@/lib/authRedirect";
import { storefrontApi, type SearchKeyword } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Category, PageResult, Product } from "@/types/api";

type Collection<T> = PageResult<T> | T[] | null;

type SessionState = {
  avatarUrl: string;
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
  const router = useRouter();
  const loginHref = useLoginRedirectHref();
  const { notify } = useToast();
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [session, setSession] = useState<SessionState>({ avatarUrl: "", token: null, username: "" });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState<SearchKeyword[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

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
      const token = getActiveAuthToken();
      setSession({
        avatarUrl: window.localStorage.getItem(AUTH_AVATAR_KEY) || "",
        token,
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

  useEffect(() => {
    const expirationMs = getAuthTokenExpirationMs(session.token);
    if (!expirationMs) {
      return;
    }

    const remainingMs = expirationMs - Date.now();
    if (remainingMs <= 0) {
      clearAuthSession();
      return;
    }

    const timer = window.setTimeout(() => {
      clearAuthSession();
      setSession({ avatarUrl: "", token: null, username: "" });
      notify({
        message: "Phien dang nhap da het han. Vui long dang nhap lai.",
        title: "Da het phien",
        type: "info",
      });
    }, remainingMs);

    return () => window.clearTimeout(timer);
  }, [notify, session.token]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      storefrontApi.popularSearchKeywords({ size: 8 }, { signal: controller.signal })
        .then((keywords) => {
          if (!controller.signal.aborted) {
            setPopularKeywords(keywords);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setPopularKeywords([]);
          }
        });
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const keyword = searchTerm.trim();
    if (keyword.length < 2) {
      const timer = window.setTimeout(() => {
        setSuggestions([]);
        setIsSuggestLoading(false);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setIsSuggestLoading(true);
      storefrontApi.searchSuggestions({ search: keyword, size: 6 }, { signal: controller.signal })
        .then((result) => {
          if (!controller.signal.aborted) {
            setSuggestions(result.content ?? []);
            setShowSuggestions(true);
          }
        })
        .catch((error: unknown) => {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            setSuggestions([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsSuggestLoading(false);
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  function handleLogout() {
    clearAuthSession();
    setSession({ avatarUrl: "", token: null, username: "" });
    setIsOpen(false);
    notify({
      message: "Phiên đăng nhập đã được kết thúc.",
      title: "Đã đăng xuất",
      type: "success",
    });
    router.push("/");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openSearchResults();
  }

  function openSearchResults(keywordOverride?: string) {
    const keyword = (keywordOverride ?? searchTerm).trim();
    if (keyword.length >= 2) {
      void storefrontApi.recordSearchKeyword(keyword).catch(() => undefined);
    }
    setIsOpen(false);
    setShowSuggestions(false);
    if (keywordOverride !== undefined) {
      setSearchTerm(keyword);
    }
    router.push(keyword ? `/products?search=${encodeURIComponent(keyword)}` : "/products");
  }

  function openProductSuggestion(product: Product) {
    setIsOpen(false);
    setShowSuggestions(false);
    setSearchTerm(product.name);
    router.push(`/products/${product.slug || product.id}`);
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
          <div className="relative hidden md:block">
            <form className="flex w-44 items-center rounded-md border border-stone-200 bg-white px-2 py-1.5 shadow-sm lg:w-64" onSubmit={handleSearch}>
              <Search aria-hidden className="h-4 w-4 shrink-0 text-stone-400" />
              <input
                aria-label="Tìm sản phẩm"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
                placeholder="Tìm sản phẩm"
                value={searchTerm}
                onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              <Button className="h-8 px-2" size="sm" type="submit" variant="ghost">
                Tìm
              </Button>
            </form>
            <SearchSuggestions
              isLoading={isSuggestLoading}
              keyword={searchTerm}
              popularKeywords={popularKeywords}
              products={suggestions}
              visible={showSuggestions}
              onSearchAll={openSearchResults}
              onSelectKeyword={openSearchResults}
              onSelect={openProductSuggestion}
            />
          </div>

          <UserOrderBell token={session.token} />

          {isLoggedIn ? (
            <div className="group relative">
              <Button variant="ghost" size="icon" aria-label={`Tài khoản ${accountName}`}>
                {session.avatarUrl ? (
                  <SafeImage alt={accountName} className="h-7 w-7 rounded-full border border-stone-200" sizes="28px" src={session.avatarUrl} />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[11px] font-semibold text-white">
                    {getInitials(accountName)}
                  </span>
                )}
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
            <Link href={loginHref}>
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
          <nav className="mx-auto grid max-w-7xl gap-2 text-sm font-medium text-stone-700">
            <div className="relative mb-1">
              <form className="flex items-center rounded-md border border-stone-200 bg-stone-50 px-2 py-1.5" onSubmit={handleSearch}>
                <Search aria-hidden className="h-4 w-4 shrink-0 text-stone-400" />
                <input
                  aria-label="Tìm sản phẩm"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
                  placeholder="Tìm sản phẩm"
                  value={searchTerm}
                  onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Button className="h-8 px-2" size="sm" type="submit" variant="ghost">
                  Tìm
                </Button>
              </form>
              <SearchSuggestions
                isLoading={isSuggestLoading}
                keyword={searchTerm}
                popularKeywords={popularKeywords}
                products={suggestions}
                visible={showSuggestions}
                onSearchAll={openSearchResults}
                onSelectKeyword={openSearchResults}
                onSelect={openProductSuggestion}
              />
            </div>
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

function SearchSuggestions({
  isLoading,
  keyword,
  popularKeywords,
  products,
  visible,
  onSearchAll,
  onSelectKeyword,
  onSelect,
}: {
  isLoading: boolean;
  keyword: string;
  onSearchAll: () => void;
  onSelectKeyword: (keyword: string) => void;
  onSelect: (product: Product) => void;
  popularKeywords: SearchKeyword[];
  products: Product[];
  visible: boolean;
}) {
  const normalizedKeyword = keyword.trim();
  if (!visible) {
    return null;
  }

  if (normalizedKeyword.length < 2) {
    if (!popularKeywords.length) {
      return null;
    }

    return (
      <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-md border border-stone-200 bg-white shadow-xl shadow-stone-950/10">
        <div className="border-b border-stone-100 px-3 py-2 text-xs font-semibold uppercase tracking-normal text-stone-500">
          Từ khóa tìm nhiều
        </div>
        <div className="flex flex-wrap gap-2 p-3">
          {popularKeywords.map((item) => (
            <button
              key={item.keyword}
              className="rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onSelectKeyword(item.keyword);
              }}
            >
              {item.keyword}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-md border border-stone-200 bg-white shadow-xl shadow-stone-950/10">
      <button
        className="flex w-full items-center gap-2 border-b border-stone-100 px-3 py-2 text-left text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          onSearchAll();
        }}
      >
        <Search aria-hidden className="h-4 w-4 shrink-0 text-stone-400" />
        <span className="min-w-0 truncate">Tìm kiếm &quot;{normalizedKeyword}&quot;</span>
      </button>

      {isLoading ? (
        <div className="px-3 py-2 text-sm text-stone-500">Đang gợi ý sản phẩm...</div>
      ) : products.length ? (
        <div className="max-h-80 overflow-y-auto p-1">
          {products.map((product) => (
            <button
              key={product.id}
              className="grid w-full grid-cols-[44px_1fr] gap-3 rounded-md p-2 text-left transition hover:bg-stone-50"
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(product);
              }}
            >
              <SafeImage
                alt={product.name}
                className="h-11 w-11 rounded-md border border-stone-100"
                sizes="44px"
                src={product.imageUrl}
              />
              <span className="min-w-0">
                <span className="line-clamp-1 block text-sm font-semibold text-stone-950">{product.name}</span>
                <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-stone-500">
                  <span className="min-w-0 truncate">{product.brand || "Korea Fashion"}</span>
                  {product.price !== undefined && product.price !== null ? (
                    <span className="shrink-0 font-semibold text-emerald-700">{formatMoney(Number(product.price))}</span>
                  ) : null}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-3 py-2 text-sm text-stone-500">Chưa có sản phẩm phù hợp.</div>
      )}
    </div>
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
