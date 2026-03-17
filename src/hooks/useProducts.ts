import { useQuery, useMutation } from '@tanstack/react-query';
import { productService, type ProductFilters } from '@/services/productService';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  });
}


export function useProductById(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}
export function useProductsByCategory(categorySlug: string, page = 1) {
  return useQuery({
    queryKey: ['products', 'category', categorySlug, page],
    queryFn: () => productService.getByCategory(categorySlug, page),
    enabled: !!categorySlug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });
}

export function useRecordProductView() {
  return useMutation({
    mutationFn: (id: string) => productService.recordView(id),
  });
}
