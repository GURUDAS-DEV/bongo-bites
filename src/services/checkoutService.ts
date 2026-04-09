import { apiClient } from "@/lib/apiClient";

interface CheckoutItemPayload {
  product_id: string;
  quantity: number;
}

interface InitiateCheckoutPayload {
  address_id: string;
  items: CheckoutItemPayload[];
  subtotal: number;
  shipping_charge: number;
  total: number;
  payment_gateway: string;
}

interface InitiateCheckoutResponse {
  message: string;
  order_id: string;
  subtotal?: number;
  shipping_charge?: number;
  total?: number;
  checkout_url?: string;
  redirect_url?: string;
  payment_gateway: string;
}

interface CheckoutStatusResponse {
  order_id: string;
  order_status: string;
  payment_status: "pending" | "paid" | "failed";
  phonepe_state: string;
}

export const checkoutService = {
  initiate: (payload: InitiateCheckoutPayload) =>
    apiClient.post<InitiateCheckoutResponse>("/checkout/initiate", payload),

  getStatus: (orderId: string) =>
    apiClient.get<CheckoutStatusResponse>(`/checkout/status/${orderId}`),
};
