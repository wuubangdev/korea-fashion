import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/checkout",
    description: "Hoan tat thong tin giao hang va thanh toan don hang Korea Fashion.",
    title: "Thanh toan",
  });
}

export default function CheckoutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
