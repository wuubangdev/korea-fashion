import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/products",
    description: "Danh sach san pham thoi trang Han Quoc moi nhat, loc theo danh muc, thuong hieu, xuat xu va muc gia.",
    title: "San pham",
  });
}

export default function ProductsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
