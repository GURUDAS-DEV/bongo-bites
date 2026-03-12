import { apiClient } from '@/lib/apiClient';
import type { Product, PaginatedResponse, Category } from '@/types';

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort?: string;
  page?: number;
  per_page?: number;
  q?: string;
}

export const productService = {
  getAll: (filters?: ProductFilters) =>
    apiClient.get<PaginatedResponse<Product>>('/products/products', filters as Record<string, string | number | boolean | undefined>),

  getBySlug: (slug: string) =>
    apiClient.get<Product>(`/products/products/${slug}`),

  getByCategory: (categorySlug: string, page = 1) =>
    apiClient.get<PaginatedResponse<Product>>(`/products/category/${categorySlug}`, { page, per_page: 20 }),

  getCategories: () =>
    apiClient.get<Category[]>('/products/categories'),
};
