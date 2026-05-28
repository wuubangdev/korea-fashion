"use client";

import { HomeCollections } from "@/components/home/HomeCollections";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeMembershipBanner } from "@/components/home/HomeMembershipBanner";
import { HomeProductSection } from "@/components/home/HomeProductSection";
import { HomeValues } from "@/components/home/HomeValues";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-stone-950">
      <StoreHeader />
      <HomeHero />
      <HomeValues />
      <HomeCollections />
      <HomeProductSection
        title="Sản phẩm mới về"
        description="Những item vừa cập nhật, phù hợp để làm mới tủ đồ hằng ngày."
        query={{ sort: "id,desc" }}
      />
      <HomeProductSection
        title="Bán chạy"
        description="Các sản phẩm được khách hàng chọn nhiều và có lượt bán nổi bật."
        query={{ sort: "soldCount,desc" }}
        tone="muted"
      />
      <HomeProductSection
        title="Được đánh giá cao"
        description="Gợi ý theo điểm rating và phản hồi của khách hàng."
        query={{ sort: "ratingAverage,desc" }}
      />
      <HomeProductSection
        title="Đang ưu đãi"
        description="Các lựa chọn có giá tốt hoặc đang nằm trong nhóm khuyến mãi."
        query={{ sale: true, sort: "id,desc" }}
        tone="muted"
      />
      <HomeMembershipBanner />
      <StoreFooter />
    </main>
  );
}
