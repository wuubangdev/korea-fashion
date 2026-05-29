const resourceLabels: Record<string, string> = {
  admins: "Quản trị viên",
  "audit-logs": "Nhật ký hệ thống",
  banners: "Banner",
  "blog-posts": "Bài viết",
  brands: "Thương hiệu",
  "cart-items": "Sản phẩm trong giỏ",
  carts: "Giỏ hàng",
  categories: "Danh mục",
  colors: "Màu sắc",
  "contact-messages": "Liên hệ",
  "coupon-redemptions": "Lượt dùng mã",
  coupons: "Mã giảm giá",
  "customer-addresses": "Địa chỉ khách hàng",
  "exchange-orders": "Đơn đổi hàng",
  faqs: "FAQ",
  "guest-customers": "Khách vãng lai",
  "inventory-transactions": "Giao dịch tồn kho",
  members: "Thành viên",
  "menu-items": "Mục menu",
  menus: "Menu",
  "order-items": "Chi tiết đơn",
  orders: "Đơn hàng",
  pages: "Trang nội dung",
  "payment-methods": "Phương thức thanh toán",
  "payment-transactions": "Giao dịch thanh toán",
  payments: "Thanh toán",
  "product-attributes": "Thuộc tính sản phẩm",
  "product-collections": "Bộ sưu tập",
  "product-images": "Ảnh sản phẩm",
  "product-option-values": "Giá trị tùy chọn",
  "product-options": "Tùy chọn sản phẩm",
  "product-relations": "Liên kết sản phẩm",
  "product-tags": "Thẻ sản phẩm",
  products: "Sản phẩm",
  "purchase-receipt-items": "Chi tiết phiếu nhập",
  "purchase-receipts": "Phiếu nhập",
  refunds: "Hoàn tiền",
  "return-items": "Sản phẩm trả hàng",
  "return-requests": "Yêu cầu trả hàng",
  "review-images": "Ảnh đánh giá",
  reviews: "Đánh giá",
  "shipment-events": "Sự kiện giao hàng",
  shipments: "Vận đơn",
  "shipping-methods": "Phương thức giao hàng",
  shippers: "Shipper",
  "site-settings": "Cấu hình website",
  sizes: "Kích cỡ",
  "store-policies": "Chính sách",
  suppliers: "Nhà cung cấp",
  users: "Người dùng",
  variants: "Biến thể",
};

const groupLabels: Record<string, string> = {
  Accounts: "Tài khoản",
  Catalog: "Sản phẩm",
  Commerce: "Bán hàng",
  Content: "Nội dung",
  System: "Hệ thống",
};

export function getAdminResourceLabel(slug: string, fallback: string) {
  return resourceLabels[slug] ?? fallback;
}

export function getAdminGroupLabel(group: string, fallback: string) {
  return groupLabels[group] ?? fallback;
}
