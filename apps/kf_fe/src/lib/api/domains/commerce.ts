import { crudEndpoint, postAction } from "../resource";
import type { RequestOptions } from "../client";

export type Cart = Record<string, unknown>;
export type CartItem = Record<string, unknown>;
export type Coupon = Record<string, unknown>;
export type CouponRedemption = Record<string, unknown>;
export type CustomerAddress = Record<string, unknown>;
export type ExchangeOrder = Record<string, unknown>;
export type GuestCustomer = Record<string, unknown>;
export type InventoryAdjustmentRequest = Record<string, unknown>;
export type InventoryAdjustmentResponse = Record<string, unknown>;
export type InventoryTransaction = Record<string, unknown>;
export type Member = Record<string, unknown>;
export type Payment = Record<string, unknown>;
export type PaymentMethod = Record<string, unknown>;
export type PaymentTransaction = Record<string, unknown>;
export type Promotion = Record<string, unknown>;
export type PurchaseReceipt = Record<string, unknown>;
export type PurchaseReceiptItem = Record<string, unknown>;
export type Refund = Record<string, unknown>;
export type ReturnItem = Record<string, unknown>;
export type ReturnRequest = Record<string, unknown>;
export type Review = Record<string, unknown>;
export type ReviewImage = Record<string, unknown>;
export type Shipment = Record<string, unknown>;
export type ShipmentEvent = Record<string, unknown>;
export type Shipper = Record<string, unknown>;
export type ShippingMethod = Record<string, unknown>;
export type Supplier = Record<string, unknown>;

export const cartsApi = crudEndpoint<Cart, Cart, Partial<Cart>>("/api/carts");
export const cartItemsApi = crudEndpoint<CartItem>("/api/cart-items");
export const couponsApi = crudEndpoint<Coupon, Coupon, Partial<Coupon>>("/api/coupons");
export const couponRedemptionsApi = crudEndpoint<CouponRedemption, CouponRedemption, Partial<CouponRedemption>>("/api/coupon-redemptions");
export const customerAddressesApi = crudEndpoint<CustomerAddress>("/api/customer-addresses");
export const exchangeOrdersApi = crudEndpoint<ExchangeOrder, ExchangeOrder, Partial<ExchangeOrder>>("/api/exchange-orders");
export const guestCustomersApi = crudEndpoint<GuestCustomer, GuestCustomer, Partial<GuestCustomer>>("/api/guest-customers");
export const inventoryTransactionsApi = crudEndpoint<InventoryTransaction>("/api/inventory-transactions");
export const membersApi = crudEndpoint<Member, Member, Partial<Member>>("/api/members");
export const paymentsApi = crudEndpoint<Payment, Payment, Partial<Payment>>("/api/payments");
export const paymentMethodsApi = crudEndpoint<PaymentMethod, PaymentMethod, Partial<PaymentMethod>>("/api/payment-methods");
export const paymentTransactionsApi = crudEndpoint<PaymentTransaction, PaymentTransaction, Partial<PaymentTransaction>>("/api/payment-transactions");
export const promotionsApi = crudEndpoint<Promotion, Promotion, Partial<Promotion>>("/api/promotions");
export const purchaseReceiptsApi = crudEndpoint<PurchaseReceipt, PurchaseReceipt, Partial<PurchaseReceipt>>("/api/purchase-receipts");
export const purchaseReceiptItemsApi = crudEndpoint<PurchaseReceiptItem>("/api/purchase-receipt-items");
export const refundsApi = crudEndpoint<Refund, Refund, Partial<Refund>>("/api/refunds");
export const returnItemsApi = crudEndpoint<ReturnItem>("/api/return-items");
export const returnRequestsApi = crudEndpoint<ReturnRequest, ReturnRequest, Partial<ReturnRequest>>("/api/return-requests");
export const reviewsApi = crudEndpoint<Review, Review, Partial<Review>>("/api/reviews");
export const reviewImagesApi = crudEndpoint<ReviewImage>("/api/review-images");
export const shipmentsApi = crudEndpoint<Shipment, Shipment, Partial<Shipment>>("/api/shipments");
export const shipmentEventsApi = crudEndpoint<ShipmentEvent>("/api/shipment-events");
export const shippersApi = crudEndpoint<Shipper, Shipper, Partial<Shipper>>("/api/shippers");
export const shippingMethodsApi = crudEndpoint<ShippingMethod, ShippingMethod, Partial<ShippingMethod>>("/api/shipping-methods");
export const suppliersApi = crudEndpoint<Supplier, Supplier, Partial<Supplier>>("/api/suppliers");

export const inventoryApi = {
  adjust: (body: InventoryAdjustmentRequest, options?: RequestOptions) =>
    postAction<InventoryAdjustmentResponse, InventoryAdjustmentRequest>("/api/inventory/adjust", body, options),
};
