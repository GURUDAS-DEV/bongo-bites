import { apiClient } from '@/lib/apiClient';
import type { Order, PaginatedResponse } from '@/types';

export const orderService = {
  // User endpoints
  create: (data: { items: { product_id: string; quantity: number }[]; address_id: string }) =>
    apiClient.post<Order>('/store/orders', data),

  getAll: () =>
    apiClient.get<Order[]>('/store/orders'),

  getById: (id: string) =>
    apiClient.get<Order>(`/store/orders/${id}`),

  // Admin endpoints
  adminGetAll: (page = 1) =>
    apiClient.get<PaginatedResponse<Order>>('/store/admin/orders', { page }),

  adminGetById: (id: string) =>
    apiClient.get<Order>(`/store/admin/orders/${id}`),

  adminCreateManual: (data: Record<string, unknown>) =>
    apiClient.post<Order>('/store/admin/orders/manual', data),

  adminUpdateStatus: (id: string, status: string) =>
    apiClient.put<Order>(`/store/admin/orders/${id}`, { status }),
};
