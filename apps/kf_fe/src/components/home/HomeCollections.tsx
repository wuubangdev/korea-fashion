"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

const collections = [
  {
    href: "/products?occasion=office",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    text: "Blazer, sơ mi và chân váy gọn form cho ngày đi làm.",
    title: "Tối giản công sở",
  },
  {
    href: "/products?occasion=campus",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    text: "Áo knit, cardigan và denim dễ phối cho đi học.",
    title: "Đi học hằng ngày",
  },
  {
    href: "/products?occasion=weekend",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    text: "Set mềm, váy xếp ly và phụ kiện nhẹ cho cuối tuần.",
    title: "Cuối tuần nhẹ nhàng",
  },
];

export function HomeCollections() {
  return (
    <section className="scroll-reveal border-y border-stone-200 bg-stone-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase text-rose-700">Bộ sưu tập</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">Phong cách nổi bật</h2>
          </div>
        </div>
        <div className="stagger-grid grid gap-4 md:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.title} href={collection.href} className="hover-lift group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm shadow-stone-950/5">
              <div className="overflow-hidden">
                <div
                  className="soft-shine aspect-[4/3] bg-stone-100 transition duration-700 ease-out group-hover:scale-[1.055]"
                  style={{
                    backgroundImage: `url('${collection.image}')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-stone-950 transition group-hover:text-emerald-800">{collection.title}</div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 transition duration-200 group-hover:translate-x-1 group-hover:text-emerald-700" />
                </div>
                <p className="mt-1 text-sm leading-6 text-stone-600">{collection.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
