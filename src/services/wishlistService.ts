import { apiClient } from '@/lib/apiClient';
import type { WishlistItem, WishlistStats } from '@/types';

export const wishlistService = {
  getAll: () =>
    apiClient.get<WishlistItem[]>('/store/wishlist'),

  add: (productId: string) =>
    apiClient.post<WishlistItem>('/store/wishlist', { product_id: productId }),

  remove: (productId: string) =>
    apiClient.delete<void>(`/store/wishlist/${productId}`),

  // Admin
  getStats: () =>
    apiClient.get<WishlistStats[]>('/api/admin/wishlist/stats'),
};
