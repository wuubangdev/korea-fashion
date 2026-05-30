import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/orders",
    description: "Theo doi trang thai don hang va lich su mua sam tai Korea Fashion.",
    title: "Don hang",
  });
}

export default function OrdersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
