import type { Product } from "@/types/api";

export type CartItem = {
  product: Product;
  quantity: number;
};

const CART_KEY = "kf_cart";

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const { product, quantity } = value as Partial<CartItem>;
  return (
    typeof product === "object" &&
    product !== null &&
    typeof product.id === "number" &&
    typeof quantity === "number" &&
    Number.isFinite(quantity) &&
    quantity > 0
  );
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const items: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(items) && items.every(isCartItem) ? items : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:update"));
}

export function addCartItem(product: Product, quantity = 1) {
  const items = getCartItems();
  const current = items.find((item) => item.product.id === product.id);

  if (current) {
    current.quantity += quantity;
    saveCartItems(items);
    return;
  }

  saveCartItems([...items, { product, quantity }]);
}

export function clearCart() {
  saveCartItems([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + Number(item.product.price ?? 0) * item.quantity,
    0,
  );
}
