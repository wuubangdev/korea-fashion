import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Theo doi thanh toan | Korea Fashion",
  description: "Kiem tra trang thai thanh toan va don hang theo thoi gian thuc.",
};

export default function PaymentStatusLayout({ children }: { children: ReactNode }) {
  return children;
}
