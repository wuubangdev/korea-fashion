import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/register",
    description: "Tao tai khoan Korea Fashion de luu thong tin mua sam va theo doi don hang.",
    title: "Dang ky",
  });
}

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
