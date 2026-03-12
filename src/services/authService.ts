import { apiClient } from "@/lib/apiClient";
import type { AuthResponse, User } from "@/types";

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>("/auth/login", { email, password }),

  register: (name: string, email: string, phone: string, password: string) =>
    apiClient.post<{ message: string }>("/auth/signup", {
      full_name: name,
      email,
      phone,
      password,
    }),

  getProfile: () => apiClient.get<User>("/profile"),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>("/api/auth/profile", data),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put<void>("/api/auth/password", {
      current_password: currentPassword,
      new_password: newPassword,
    }),
};
