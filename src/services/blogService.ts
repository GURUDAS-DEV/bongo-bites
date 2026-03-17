import { apiClient } from '@/lib/apiClient';
import type { Blog, PaginatedResponse } from '@/types';

export const blogService = {
  getAll: (page = 1) =>
    apiClient.get<PaginatedResponse<Blog>>('/blogs', { page, per_page: 12 }),

  getBySlug: (slug: string) =>
    apiClient.get<Blog>(`/blogs/${slug}`),
};
