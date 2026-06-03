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
  shortDescription?: string;
  imageUrl?: string;
  price?: number | string;
  brand?: string;
  brandId?: string;
  origin?: string;
  categoryId?: number;
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
  seoKeywords?: string;
  seoThumbnailUrl?: string;
  canonicalUrl?: string;
};

export type Review = {
  id: string;
  productId?: number;
  userId?: number;
  parentReviewId?: string;
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
  dislikeCount?: number;
  currentUserReaction?: "LIKE" | "DISLIKE" | string | null;
  reportCount?: number;
  adminReply?: string;
  adminRepliedAt?: string;
  reviewedAt?: string;
  images?: ReviewImage[];
};

export type ReviewImage = {
  id?: number;
  reviewId?: string;
  imageUrl: string;
  altText?: string;
  displayOrder?: number;
  active?: boolean;
};

export type CreateReviewPayload = {
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  content?: string;
  imageUrls?: string[];
};

export type ReplyReviewPayload = {
  content: string;
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

export type ContactMessage = {
  id?: number;
  fullName: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: "NEW" | "IN_PROGRESS" | "RESOLVED" | "SPAM" | string;
  source?: string;
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateContactMessagePayload = {
  fullName: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: string;
};

export type User = {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  avatarUrl?: string;
  roles?: string[];
};

export type UpdateProfilePayload = {
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
};

export type UpdateAvatarPayload = {
  avatarUrl?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
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
  productName?: string;
  productImageUrl?: string;
  sku?: string;
  size?: string;
  color?: string;
  quantity: number;
  price?: number | string;
  unitPrice?: number | string;
  discount?: number | string;
  total?: number | string;
};

export type Order = {
  id: number;
  orderCode?: string;
  customerId?: number;
  guestCustomerId?: string;
  orderDate?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  subtotal?: number | string;
  discountTotal?: number | string;
  shippingFee?: number | string;
  taxTotal?: number | string;
  total?: number | string;
  grandTotal?: number | string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  status?: string;
  shipperId?: string;
  shippingStatus?: string;
  deliveryAddress?: string;
  shippingMethodId?: string;
  paymentMethodId?: string;
  couponCode?: string;
  cancelReason?: string;
  confirmedAt?: string;
  packedAt?: string;
  assignedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  returnedAt?: string;
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

export type MediaAsset = {
  id: number;
  folder?: string;
  name?: string;
  originalFilename?: string;
  url: string;
  storagePath?: string;
  contentType?: string;
  mediaType?: "IMAGE" | "VIDEO" | "OTHER" | string;
  sizeBytes?: number;
  external?: boolean;
  createdAt?: string;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateOrderPayload = {
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryAddress: string;
  discountTotal?: number;
  shippingFee?: number;
  taxTotal?: number;
  shippingMethodId?: string;
  paymentMethodId?: string;
  couponCode?: string;
  note?: string;
  items: Array<{
    productId: number;
    variantId?: number;
    productName?: string;
    productImageUrl?: string;
    sku?: string;
    size?: string;
    color?: string;
    quantity: number;
    price?: number;
    unitPrice: number;
    discount?: number;
  }>;
};
