"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";

const collections = [
  {
    badge: "Office edit",
    href: "/products?occasion=office",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    text: "Blazer, sơ mi và chân váy gọn form cho ngày đi làm.",
    title: "Tối giản công sở",
  },
  {
    badge: "Campus casual",
    href: "/products?occasion=campus",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    text: "Áo knit, cardigan và denim dễ phối cho đi học.",
    title: "Đi học hằng ngày",
  },
  {
    badge: "Weekend soft",
    href: "/products?occasion=weekend",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    text: "Set mềm, váy xếp ly và phụ kiện nhẹ cho cuối tuần.",
    title: "Cuối tuần nhẹ nhàng",
  },
];

export function HomeCollections() {
  const [primary, ...secondary] = collections;

  return (
    <section className="scroll-reveal border-y border-stone-200 bg-[#f7f4ef] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase text-rose-700">Bộ sưu tập</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-normal text-stone-950">Phong cách nổi bật</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Các gợi ý phối đồ được nhóm theo lịch trình hằng ngày, từ công sở gọn gàng đến cuối tuần mềm mại.
            </p>
          </div>
        </div>

        <div className="stagger-grid grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)]">
          <CollectionCard collection={primary} featured />
          <div className="grid gap-4">
            {secondary.map((collection) => (
              <CollectionCard key={collection.title} collection={collection} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  featured = false,
}: {
  collection: (typeof collections)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={collection.href}
      className={`group relative isolate overflow-hidden rounded-lg border border-white/70 bg-stone-900 shadow-xl shadow-stone-950/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-950/18 ${
        featured ? "min-h-[520px]" : "min-h-[252px]"
      }`}
    >
      <SafeImage
        alt={collection.title}
        className="absolute inset-0 h-full w-full transition duration-700 ease-out group-hover:scale-[1.055]"
        sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 34vw, 100vw"}
        src={collection.image}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10),rgba(15,23,42,0.72))]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] [background-size:13px_13px]" />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-5 text-white sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md border border-white/22 bg-white/14 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/82 backdrop-blur">
            {collection.badge}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-stone-950 transition group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
        <div className={featured ? "max-w-xl" : "max-w-sm"}>
          <h3 className={`${featured ? "text-4xl" : "text-2xl"} font-semibold leading-tight tracking-normal`}>
            {collection.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/74">{collection.text}</p>
        </div>
      </div>
    </Link>
  );
}
