"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addCartItem,
  cartTotal,
  clearCart,
  getCartItems,
  saveCartItems,
  type CartItem,
} from "@/lib/cart";
import type { Product } from "@/types/api";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const sync = useCallback(() => {
    setItems(getCartItems());
  }, []);

  useEffect(() => {
    queueMicrotask(sync);
    window.addEventListener("cart:update", sync);
    return () => window.removeEventListener("cart:update", sync);
  }, [sync]);

  const add = useCallback((product: Product, quantity = 1) => {
    addCartItem(product, quantity);
    sync();
  }, [sync]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const nextItems = getCartItems()
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      )
      .filter((item) => item.quantity > 0);

    saveCartItems(nextItems);
    setItems(nextItems);
  }, []);

  const remove = useCallback((productId: number) => {
    const nextItems = getCartItems().filter((item) => item.product.id !== productId);
    saveCartItems(nextItems);
    setItems(nextItems);
  }, []);

  const clear = useCallback(() => {
    clearCart();
    setItems([]);
  }, []);

  return {
    add,
    clear,
    count: items.reduce((total, item) => total + item.quantity, 0),
    items,
    remove,
    total: cartTotal(items),
    updateQuantity,
  };
}
