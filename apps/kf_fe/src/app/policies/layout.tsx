import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/policies",
    description: "Thong tin chinh sach mua hang, doi tra, giao hang va ho tro khach hang cua Korea Fashion.",
    title: "Chinh sach",
  });
}

export default function PoliciesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
