export type SortDirection = "asc" | "desc";

export type PageResult<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type PageQuery = {
  page: number;
  size: number;
  search?: string;
  sort?: string;
  filters?: Record<string, string | number | boolean | undefined | null>;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number | string;
  brand?: string;
  origin?: string;
  sku?: string;
  slug?: string;
  material?: string;
  careInstructions?: string;
  fit?: string;
  gender?: string;
  season?: string;
  countryOfManufacture?: string;
  status?: string;
  stockQuantity?: number;
  compareAtPrice?: number | string;
  ratingAverage?: number | string;
  reviewCount?: number;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type Review = {
  id: string;
  productId?: number;
  userId?: number;
  orderId?: number;
  orderItemId?: number;
  rating?: number;
  title?: string;
  content?: string;
  status?: string;
  reviewerName?: string;
  reviewerAvatarUrl?: string;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
  reportCount?: number;
  adminReply?: string;
  adminRepliedAt?: string;
  reviewedAt?: string;
};

export type CreateReviewPayload = {
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  content?: string;
};

export type ProductPayload = {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  brand?: string;
  origin?: string;
  sku?: string;
  slug?: string;
  material?: string;
  careInstructions?: string;
  fit?: string;
  gender?: string;
  season?: string;
  countryOfManufacture?: string;
  status?: string;
  stockQuantity?: number;
  compareAtPrice?: number;
  ratingAverage?: number;
  reviewCount?: number;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type Category = {
  id: number;
  code?: string;
  name: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  parentId?: number;
  displayOrder?: number;
  active?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  placement?: string;
  displayOrder?: number;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
};

export type SiteSetting = {
  id: string;
  siteName: string;
  siteDescription?: string;
  mainLogoUrl?: string;
  footerLogoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoThumbnailUrl?: string;
  canonicalUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  messengerUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  zaloUrl?: string;
  hotline?: string;
  email?: string;
  address?: string;
  footerAbout?: string;
};

export type User = {
  id: number;
  username: string;
  email?: string;
  roles?: string[];
};

export type AuthRequest = {
  username: string;
  password: string;
  email?: string;
};

export type AuthResponse = {
  username: string;
  token: string;
};

export type OrderItem = {
  id: number;
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice?: number | string;
  total?: number | string;
};

export type Order = {
  id: number;
  orderCode?: string;
  orderDate?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  total?: number | string;
  grandTotal?: number | string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  status?: string;
  shipperId?: string;
  shippingStatus?: string;
  deliveryAddress?: string;
  note?: string;
  items?: OrderItem[];
};

export type Payment = {
  id: string;
  orderId?: number;
  amount?: number | string;
  paidAt?: string;
  method?: string;
  status?: string;
};

export type CreateOrderPayload = {
  deliveryAddress: string;
  note?: string;
  items: Array<{
    productId: number;
    variantId?: number;
    quantity: number;
    unitPrice: number;
  }>;
};
