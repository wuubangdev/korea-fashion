import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/contact",
    description: "Lien he Korea Fashion de duoc ho tro ve san pham, don hang, doi tra va trai nghiem mua sam.",
    title: "Lien he",
  });
}

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
