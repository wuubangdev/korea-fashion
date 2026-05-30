import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";
import { storefrontApi } from "@/lib/api/domains/storefront";
import type { Product } from "@/types/api";
import { ProductDetailClient } from "./ProductDetailClient";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await storefrontApi.product(id, {
      next: { revalidate: 300, tags: ["products", `product-${id}`] },
    }) as Product;
    const title = product.seoTitle || product.name;
    const description = product.seoDescription || product.shortDescription || product.description;
    const slugOrId = product.slug || String(product.id || id);

    return generateSeoMetadata({
      canonicalPath: product.canonicalUrl || `/products/${slugOrId}`,
      description,
      imageAlt: product.name,
      imageUrl: product.seoThumbnailUrl || product.imageUrl,
      keywords: product.seoKeywords || product.tags,
      title,
      type: "article",
    });
  } catch {
    return generateSeoMetadata({
      canonicalPath: `/products/${id}`,
      title: "San pham",
    });
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return <ProductDetailClient productId={id} />;
}
