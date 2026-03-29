import { apiClient } from "@/lib/apiClient";
import type { Product, DashboardStats } from "@/types";

export const adminService = {
  getDashboard: () => apiClient.get<DashboardStats>("/store/admin/dashboard"),

  // Categories
  getCategories: () =>
    apiClient.get<
      { id: string; name: string; slug: string; created_at: string }[]
    >("/api/categories"),

  createCategory: (data: { name: string; slug: string }) =>
    apiClient.post<{
      id: string;
      name: string;
      slug: string;
      created_at: string;
    }>("/api/categories", data),

  updateCategory: (id: string, data: { name: string; slug: string }) =>
    apiClient.put<{
      id: string;
      name: string;
      slug: string;
      created_at: string;
    }>(`/api/categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete<{ message: string }>(`/api/categories/${id}`),

  // Products
  getProducts: (page = 1, limit = 20) =>
    apiClient.get("/products/products", {
      params: { limit, offset: (page - 1) * limit },
    }),

  createProduct: (data: any) => apiClient.post<Product>("/products/products", data),

  updateProduct: (id: string, data: any) =>
    apiClient.put<Product>(`/products/products/${id}`, data),

  deleteProduct: (id: string) =>
    apiClient.delete<{ message: string }>(`/products/products/${id}`),

  // Product Images
  getProductImages: (productId: string) =>
    apiClient.get("/products/products/${productId}/images"),

  addProductImage: (
    productId: string,
    data: { image_url: string; alt_text?: string; sort_order?: number },
  ) => apiClient.post("/products/products/${productId}/images", data),

  updateProductImage: (
    productId: string,
    imageId: string,
    data: { image_url: string; alt_text?: string; sort_order?: number },
  ) => apiClient.put("/products/products/${productId}/images/${imageId}", data),

  deleteProductImage: (productId: string, imageId: string) =>
    apiClient.delete("/products/products/${productId}/images/${imageId}"),
};
