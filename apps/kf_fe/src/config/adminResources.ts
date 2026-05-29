export type AdminResourceGroup = "Catalog" | "Commerce" | "Content" | "Accounts" | "System";

export type AdminResource = {
  actions?: {
    bulkDelete?: boolean;
    bulkHardDelete?: boolean;
    copy?: boolean;
    create?: boolean;
    hardDelete?: boolean;
    softDelete?: boolean;
    update?: boolean;
  };
  description: string;
  group: AdminResourceGroup;
  label: string;
  path: string;
  preferredColumns?: string[];
  slug: string;
};

const crudActions = {
  create: true,
  hardDelete: true,
  softDelete: true,
  update: true,
};

const extendedActions = {
  ...crudActions,
  bulkDelete: true,
  bulkHardDelete: true,
  copy: true,
};

export const adminResources: AdminResource[] = [
  { slug: "products", label: "Sản phẩm", path: "/api/products", group: "Catalog", actions: extendedActions, description: "Quản lý danh mục, giá, tồn kho, hình ảnh và SEO sản phẩm.", preferredColumns: ["id", "name", "sku", "brand", "price", "stockQuantity", "status"] },
  { slug: "variants", label: "Biến thể", path: "/api/variants", group: "Catalog", actions: extendedActions, description: "Kích cỡ, màu sắc, SKU và tồn kho theo biến thể.", preferredColumns: ["id", "productId", "sku", "sizeId", "colorId", "price", "stockQuantity"] },
  { slug: "categories", label: "Danh mục", path: "/api/categories", group: "Catalog", actions: extendedActions, description: "Nhóm hàng, menu danh mục và cấu trúc điều hướng.", preferredColumns: ["id", "code", "name", "slug", "parentId", "active"] },
  { slug: "brands", label: "Thương hiệu", path: "/api/brands", group: "Catalog", actions: crudActions, description: "Danh sách thương hiệu.", preferredColumns: ["id", "name", "code", "active"] },
  { slug: "colors", label: "Màu sắc", path: "/api/colors", group: "Catalog", actions: crudActions, description: "Bảng màu sản phẩm.", preferredColumns: ["id", "name", "code", "hexCode"] },
  { slug: "sizes", label: "Kích cỡ", path: "/api/sizes", group: "Catalog", actions: crudActions, description: "Bảng kích cỡ sản phẩm.", preferredColumns: ["id", "name", "code", "displayOrder"] },
  { slug: "product-images", label: "Ảnh sản phẩm", path: "/api/product-images", group: "Catalog", actions: crudActions, description: "Thư viện ảnh theo sản phẩm.", preferredColumns: ["id", "productId", "imageUrl", "displayOrder", "primary"] },
  { slug: "product-options", label: "Tùy chọn sản phẩm", path: "/api/product-options", group: "Catalog", actions: crudActions, description: "Tùy chọn sản phẩm.", preferredColumns: ["id", "productId", "name", "displayOrder"] },
  { slug: "product-option-values", label: "Giá trị tùy chọn", path: "/api/product-option-values", group: "Catalog", actions: crudActions, description: "Giá trị của tùy chọn sản phẩm.", preferredColumns: ["id", "optionId", "value", "displayOrder"] },
  { slug: "product-attributes", label: "Thuộc tính sản phẩm", path: "/api/product-attributes", group: "Catalog", actions: crudActions, description: "Thuộc tính mở rộng của sản phẩm.", preferredColumns: ["id", "productId", "name", "value"] },
  { slug: "product-collections", label: "Bộ sưu tập", path: "/api/product-collections", group: "Catalog", actions: crudActions, description: "Bộ sưu tập sản phẩm.", preferredColumns: ["id", "name", "slug", "active"] },
  { slug: "product-relations", label: "Liên kết sản phẩm", path: "/api/product-relations", group: "Catalog", actions: crudActions, description: "Sản phẩm liên quan, gợi ý và bán kèm.", preferredColumns: ["id", "productId", "relatedProductId", "type"] },
  { slug: "product-tags", label: "Thẻ sản phẩm", path: "/api/product-tags", group: "Catalog", actions: crudActions, description: "Nhãn sản phẩm.", preferredColumns: ["id", "name", "slug"] },

  { slug: "orders", label: "Đơn hàng", path: "/api/orders", group: "Commerce", actions: extendedActions, description: "Xử lý đơn, trạng thái thanh toán và giao hàng.", preferredColumns: ["id", "orderDate", "status", "shippingStatus", "total", "shipperId"] },
  { slug: "order-items", label: "Chi tiết đơn", path: "/api/order-items", group: "Commerce", description: "Dòng sản phẩm trong đơn hàng.", preferredColumns: ["id", "orderId", "productId", "variantId", "quantity", "total"] },
  { slug: "carts", label: "Giỏ hàng", path: "/api/carts", group: "Commerce", description: "Giỏ hàng của khách.", preferredColumns: ["id", "userId", "status", "updatedAt"] },
  { slug: "cart-items", label: "Sản phẩm trong giỏ", path: "/api/cart-items", group: "Commerce", description: "Sản phẩm trong giỏ hàng.", preferredColumns: ["id", "cartId", "productId", "variantId", "quantity"] },
  { slug: "coupons", label: "Mã giảm giá", path: "/api/coupons", group: "Commerce", description: "Mã giảm giá và điều kiện áp dụng.", preferredColumns: ["id", "code", "discountType", "discountValue", "active", "expiresAt"] },
  { slug: "coupon-redemptions", label: "Lượt dùng mã", path: "/api/coupon-redemptions", group: "Commerce", description: "Lịch sử sử dụng mã giảm giá.", preferredColumns: ["id", "couponId", "userId", "orderId", "redeemedAt"] },
  { slug: "promotions", label: "Khuyến mãi", path: "/api/promotions", group: "Commerce", description: "Chương trình khuyến mãi.", preferredColumns: ["id", "name", "type", "active", "startsAt", "endsAt"] },
  { slug: "payments", label: "Thanh toán", path: "/api/payments", group: "Commerce", description: "Bản ghi thanh toán.", preferredColumns: ["id", "orderId", "amount", "status", "method"] },
  { slug: "payment-methods", label: "Phương thức thanh toán", path: "/api/payment-methods", group: "Commerce", description: "Phương thức thanh toán.", preferredColumns: ["id", "name", "code", "active"] },
  { slug: "payment-transactions", label: "Giao dịch thanh toán", path: "/api/payment-transactions", group: "Commerce", description: "Giao dịch thanh toán.", preferredColumns: ["id", "paymentId", "amount", "status", "transactionCode"] },
  { slug: "shipping-methods", label: "Phương thức giao hàng", path: "/api/shipping-methods", group: "Commerce", description: "Phương thức và phí giao hàng.", preferredColumns: ["id", "name", "code", "fee", "active"] },
  { slug: "shipments", label: "Vận đơn", path: "/api/shipments", group: "Commerce", description: "Thông tin vận chuyển.", preferredColumns: ["id", "orderId", "trackingCode", "status", "shipperId"] },
  { slug: "shipment-events", label: "Sự kiện giao hàng", path: "/api/shipment-events", group: "Commerce", description: "Dòng thời gian giao hàng.", preferredColumns: ["id", "shipmentId", "status", "createdAt"] },
  { slug: "shippers", label: "Shipper", path: "/api/shippers", group: "Commerce", description: "Nhân sự giao hàng.", preferredColumns: ["id", "name", "phone", "active"] },
  { slug: "inventory-transactions", label: "Giao dịch tồn kho", path: "/api/inventory-transactions", group: "Commerce", description: "Lịch sử nhập xuất tồn kho.", preferredColumns: ["id", "productId", "variantId", "quantity", "type", "createdAt"] },
  { slug: "purchase-receipts", label: "Phiếu nhập", path: "/api/purchase-receipts", group: "Commerce", description: "Phiếu nhập hàng.", preferredColumns: ["id", "supplierId", "total", "status", "createdAt"] },
  { slug: "purchase-receipt-items", label: "Chi tiết phiếu nhập", path: "/api/purchase-receipt-items", group: "Commerce", description: "Dòng sản phẩm trong phiếu nhập.", preferredColumns: ["id", "receiptId", "productId", "variantId", "quantity"] },
  { slug: "suppliers", label: "Nhà cung cấp", path: "/api/suppliers", group: "Commerce", description: "Đối tác cung cấp hàng.", preferredColumns: ["id", "name", "phone", "email", "active"] },
  { slug: "return-requests", label: "Yêu cầu trả hàng", path: "/api/return-requests", group: "Commerce", description: "Yêu cầu đổi trả của khách.", preferredColumns: ["id", "orderId", "status", "reason", "createdAt"] },
  { slug: "return-items", label: "Sản phẩm trả hàng", path: "/api/return-items", group: "Commerce", description: "Sản phẩm trong yêu cầu trả hàng.", preferredColumns: ["id", "returnRequestId", "orderItemId", "quantity"] },
  { slug: "exchange-orders", label: "Đơn đổi hàng", path: "/api/exchange-orders", group: "Commerce", description: "Đơn hàng đổi sản phẩm.", preferredColumns: ["id", "orderId", "status", "createdAt"] },
  { slug: "refunds", label: "Hoàn tiền", path: "/api/refunds", group: "Commerce", description: "Hoàn tiền đơn hàng.", preferredColumns: ["id", "orderId", "amount", "status", "createdAt"] },
  { slug: "reviews", label: "Đánh giá", path: "/api/reviews", group: "Commerce", description: "Đánh giá sản phẩm.", preferredColumns: ["id", "productId", "rating", "status", "reviewerName", "reviewedAt"] },
  { slug: "review-images", label: "Ảnh đánh giá", path: "/api/review-images", group: "Commerce", description: "Ảnh đính kèm đánh giá.", preferredColumns: ["id", "reviewId", "imageUrl", "displayOrder"] },

  { slug: "banners", label: "Banner", path: "/api/banners", group: "Content", description: "Banner hiển thị ngoài cửa hàng.", preferredColumns: ["id", "title", "placement", "displayOrder", "active"] },
  { slug: "blog-posts", label: "Bài viết", path: "/api/blog-posts", group: "Content", description: "Nội dung blog.", preferredColumns: ["id", "title", "slug", "status", "publishedAt"] },
  { slug: "contact-messages", label: "Liên hệ", path: "/api/contact-messages", group: "Content", actions: extendedActions, description: "Tin nhắn liên hệ từ khách hàng.", preferredColumns: ["id", "fullName", "phone", "email", "subject", "status", "createdAt"] },
  { slug: "faqs", label: "FAQ", path: "/api/faqs", group: "Content", description: "Câu hỏi thường gặp.", preferredColumns: ["id", "question", "displayOrder", "active"] },
  { slug: "menus", label: "Menu", path: "/api/menus", group: "Content", description: "Menu hiển thị ngoài cửa hàng.", preferredColumns: ["id", "name", "code", "active"] },
  { slug: "menu-items", label: "Mục menu", path: "/api/menu-items", group: "Content", description: "Liên kết trong menu.", preferredColumns: ["id", "menuId", "label", "url", "displayOrder"] },
  { slug: "pages", label: "Trang nội dung", path: "/api/pages", group: "Content", description: "Trang tĩnh.", preferredColumns: ["id", "title", "slug", "status", "publishedAt"] },
  { slug: "site-settings", label: "Cấu hình website", path: "/api/site-settings", group: "Content", description: "Logo, SEO, liên hệ và cấu hình cửa hàng.", preferredColumns: ["id", "siteName", "hotline", "email", "canonicalUrl"] },
  { slug: "store-policies", label: "Chính sách", path: "/api/store-policies", group: "Content", description: "Chính sách cửa hàng.", preferredColumns: ["id", "title", "slug", "active"] },

  { slug: "users", label: "Người dùng", path: "/api/users", group: "Accounts", description: "Tài khoản và vai trò.", preferredColumns: ["id", "username", "email", "roles"] },
  { slug: "admins", label: "Quản trị viên", path: "/api/admins", group: "Accounts", description: "Tài khoản quản trị.", preferredColumns: ["id", "username", "email", "active"] },
  { slug: "members", label: "Thành viên", path: "/api/members", group: "Accounts", description: "Hồ sơ khách hàng thành viên.", preferredColumns: ["id", "userId", "name", "phone", "tier"] },
  { slug: "guest-customers", label: "Khách vãng lai", path: "/api/guest-customers", group: "Accounts", description: "Thông tin khách không đăng nhập.", preferredColumns: ["id", "name", "phone", "email"] },
  { slug: "customer-addresses", label: "Địa chỉ khách hàng", path: "/api/customer-addresses", group: "Accounts", description: "Địa chỉ giao hàng của khách.", preferredColumns: ["id", "userId", "receiverName", "phone", "address"] },
  { slug: "audit-logs", label: "Nhật ký hệ thống", path: "/api/audit-logs", group: "System", description: "Lịch sử hành động hệ thống.", preferredColumns: ["id", "actor", "action", "entityType", "createdAt"] },
];

export const adminResourceGroups = ["Catalog", "Commerce", "Content", "Accounts", "System"] as const;

export const adminResourceGroupLabels: Record<AdminResourceGroup, string> = {
  Accounts: "Tài khoản",
  Catalog: "Danh mục sản phẩm",
  Commerce: "Bán hàng",
  Content: "Nội dung",
  System: "Hệ thống",
};

export function findAdminResource(slug: string) {
  return adminResources.find((resource) => resource.slug === slug);
}
