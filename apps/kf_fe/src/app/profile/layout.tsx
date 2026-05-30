import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/profile",
    description: "Quan ly ho so, phien dang nhap va cac tac vu mua sam cua tai khoan Korea Fashion.",
    title: "Tai khoan",
  });
}

export default function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
