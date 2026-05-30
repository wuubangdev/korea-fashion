import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/cart",
    description: "Xem gio hang va kiem tra cac san pham thoi trang Han Quoc truoc khi thanh toan.",
    title: "Gio hang",
  });
}

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
