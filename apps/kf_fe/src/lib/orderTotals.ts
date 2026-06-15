export const DEFAULT_SHIPPING_FEE = 30_000;
export const FREE_SHIPPING_THRESHOLD = 1_000_000;

type ShippingFeeInput = {
  baseFee?: number;
  freeShipping?: boolean;
  itemCount: number;
  subtotal: number;
};

export function calculateShippingFee({
  baseFee = DEFAULT_SHIPPING_FEE,
  freeShipping = false,
  itemCount,
  subtotal,
}: ShippingFeeInput) {
  if (freeShipping || itemCount === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return baseFee;
}

export function calculateOrderTotal({
  discountAmount = 0,
  shippingFee = 0,
  subtotal,
}: {
  discountAmount?: number;
  shippingFee?: number;
  subtotal: number;
}) {
  return Math.max(subtotal - discountAmount, 0) + shippingFee;
}
