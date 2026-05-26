import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Tong quan" },
  { href: "/admin", label: "Admin" },
  { href: "/products", label: "San pham" },
  { href: "/categories", label: "Danh muc" },
  { href: "/orders", label: "Don hang" },
  { href: "/users", label: "Nguoi dung" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Korea Fashion Admin
          </Link>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
