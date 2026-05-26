import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  {
    title: "Outerwear",
    description: "Ao khoac, blazer va trench coat cho nhung ngay can layer.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Daily essentials",
    description: "Nhung mon mac hang ngay voi form gon, de phoi.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Accessories",
    description: "Tui, mu, kinh va chi tiet nho hoan thien outfit.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  },
];

const featuredProducts = [
  {
    name: "Seoul cropped blazer",
    price: "1.290.000 VND",
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Minimal knit cardigan",
    price: "790.000 VND",
    tag: "Best seller",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Soft pleated skirt",
    price: "620.000 VND",
    tag: "Limited",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
];

const values = [
  "Form dang Han Quoc",
  "Chat lieu de mac hang ngay",
  "Goi hang trong 24h",
  "Doi size linh hoat",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-30 border-b border-white/30 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Korea Fashion
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="#collection" className="hover:text-slate-950">
              Collection
            </Link>
            <Link href="#new-arrivals" className="hover:text-slate-950">
              New arrivals
            </Link>
            <Link href="/products" className="hover:text-slate-950">
              San pham
            </Link>
            <Link href="/admin" className="hover:text-slate-950">
              Admin
            </Link>
          </nav>
          <Link href="/products">
            <Button size="sm">Mua ngay</Button>
          </Link>
        </div>
      </header>

      <section
        className="relative flex min-h-[calc(100vh-72px)] items-end overflow-hidden bg-slate-900"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15,23,42,0.82), rgba(15,23,42,0.42), rgba(15,23,42,0.08)), url('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1800&q=85')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-24 text-white sm:px-6 lg:grid-cols-[minmax(0,620px)_1fr] lg:px-8">
          <div>
            <Badge className="bg-white/15 text-white backdrop-blur">
              Spring edit 2026
            </Badge>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Korea Fashion
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Wardrobe hien dai lay cam hung tu street style Seoul: gon gang,
              de mac va du chi tiet de noi bat moi ngay.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products">
                <Button className="bg-white text-slate-950 hover:bg-slate-100">
                  Kham pha san pham
                </Button>
              </Link>
              <Link href="#collection">
                <Button
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white hover:bg-white/20"
                >
                  Xem collection
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden self-end lg:block">
            <div className="grid grid-cols-2 gap-3 text-sm text-white">
              {values.map((value) => (
                <div
                  key={value}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="bg-slate-50 py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Shop by mood
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                Chon nhanh theo phong cach
              </h2>
            </div>
            <Link href="/categories" className="text-sm font-medium text-slate-700">
              Xem danh muc
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.title} className="overflow-hidden">
                <div
                  className="h-64 bg-slate-200"
                  style={{
                    backgroundImage: `url('${category.image}')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                New arrivals
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                San pham noi bat
              </h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-slate-700">
              Xem tat ca
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card key={product.name} className="overflow-hidden">
                <div
                  className="relative h-80 bg-slate-200"
                  style={{
                    backgroundImage: `url('${product.image}')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  <Badge className="absolute left-3 top-3 bg-white text-slate-950">
                    {product.tag}
                  </Badge>
                </div>
                <CardContent className="flex items-start justify-between gap-3 pt-5">
                  <div>
                    <h3 className="font-semibold text-slate-950">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{product.price}</p>
                  </div>
                  <Link href="/products">
                    <Button variant="outline" size="sm">
                      Xem
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-white/60">
              Korea Fashion system
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              San sang noi voi API va khu quan tri
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              Trang chu public co the dung lam mat tien cua shop, trong khi cac
              route admin van giu bang du lieu phan trang, search, sort va filter.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/admin">
              <Button className="w-full bg-white text-slate-950 hover:bg-slate-100">
                Vao admin
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                className="w-full border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Quan ly san pham
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
