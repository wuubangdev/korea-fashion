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
};

export type ProductPayload = {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  brand?: string;
  origin?: string;
};

export type Category = {
  id: number;
  code?: string;
  name: string;
  description?: string;
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
  orderDate?: string;
  total?: number | string;
  status?: string;
  shipperId?: string;
  shippingStatus?: string;
  deliveryAddress?: string;
  note?: string;
  items?: OrderItem[];
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
