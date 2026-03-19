import { apiClient } from "@/lib/apiClient";
import type {
  Product,
  PaginatedResponse,
  Category,
  ProductImage,
} from "@/types";

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
    apiClient.get<PaginatedResponse<Product>>(
      "/products/products",
      filters as Record<string, string | number | boolean | undefined>,
    ),

  getBySlug: (slug: string) =>
    apiClient.get<Product>(`/products/products/${slug}`),

  getById: (id: string) => apiClient.get<Product>(`/products/id/${id}`),

  getByCategory: (categorySlug: string, page = 1) =>
    apiClient.get<PaginatedResponse<Product>>(
      `/products/category/${categorySlug}`,
      { page, per_page: 20 },
    ),

  getCategories: () => apiClient.get<Category[]>("/products/categories"),

  // Image-related functions
  getProductImages: (productId: string) =>
    apiClient.get<ProductImage[]>(`/products/images/${productId}`),

  addProductImage: (
    productId: string,
    data: { image_url: string; alt_text?: string; sort_order?: number },
  ) => apiClient.post<ProductImage>(`/products/images/${productId}`, data),

  updateProductImage: (
    productId: string,
    imageId: string,
    data: { image_url: string; alt_text?: string; sort_order?: number },
  ) =>
    apiClient.put<ProductImage>(
      `/products/images/${productId}/${imageId}`,
      data,
    ),

  deleteProductImage: (productId: string, imageId: string) =>
    apiClient.delete(`/products/images/${productId}/${imageId}`),

  notifyMe: (productId: string) =>
    apiClient.post(`/products/notify-me`, { product_id: productId }),

  // Upload image to Cloudflare R2
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      "http://localhost:3000/products/upload-image",
      {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Image upload failed",
      }));
      throw new Error(error.message);
    }

    return response.json() as Promise<{ url: string }>;
  },

  recordView: (id: string) => apiClient.post(`/products/view/${id}`),
};
