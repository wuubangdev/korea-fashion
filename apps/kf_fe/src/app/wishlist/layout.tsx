import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/wishlist",
    description: "Danh sach san pham yeu thich cua ban tai Korea Fashion.",
    title: "Yeu thich",
  });
}

export default function WishlistLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
