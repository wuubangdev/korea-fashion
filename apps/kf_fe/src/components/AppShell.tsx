import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

const navGroups = [
  {
    title: "Van hanh",
    items: [
      { href: "/admin", label: "Dashboard", meta: "Tong quan shop" },
      { href: "/orders", label: "Don hang", meta: "Xu ly va giao hang" },
      { href: "/products", label: "San pham", meta: "Gia, ton kho, hinh anh" },
      { href: "/categories", label: "Danh muc", meta: "Bo suu tap va nhom hang" },
    ],
  },
  {
    title: "Khach hang",
    items: [
      { href: "/users", label: "Nguoi dung", meta: "Tai khoan va vai tro" },
      { href: "/login", label: "Dang nhap", meta: "Kiem tra phien quan tri" },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="min-w-0" aria-label="Korea Fashion admin">
              <Image
                src="/korea-fashion-logo.svg"
                alt="Korea Fashion"
                width={165}
                height={36}
                priority
                className="h-9 w-auto"
              />
              <div className="mt-1 text-xs font-medium uppercase text-slate-500">
                Commerce admin
              </div>
            </Link>
            <Link
              href="/"
              className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Shop
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-xs font-medium text-emerald-700">Hom nay</div>
              <div className="mt-1 text-lg font-semibold text-emerald-950">24</div>
              <div className="text-xs text-emerald-700">don moi</div>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="text-xs font-medium text-amber-700">Can xu ly</div>
              <div className="mt-1 text-lg font-semibold text-amber-950">8</div>
              <div className="text-xs text-amber-700">viec</div>
            </div>
          </div>

          <nav className="mt-6 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <div className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.title}
                </div>
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2.5 transition hover:bg-slate-100"
                    >
                      <span className="block text-sm font-medium text-slate-900">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {item.meta}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-3 lg:mt-auto">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              He thong
            </div>
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>API</span>
                <span className="font-medium text-emerald-700">Online</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Phien</span>
                <span className="font-medium text-slate-950">JWT</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-slate-200 bg-white">
          <div className="flex min-h-16 flex-col justify-center gap-1 px-4 py-4 sm:px-6 lg:px-8">
            <div className="text-sm font-medium text-slate-500">
              Bang dieu khien quan tri
            </div>
            <div className="text-lg font-semibold tracking-tight">
              Quan ly nen tang thuong mai dien tu
            </div>
          </div>
        </header>
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
