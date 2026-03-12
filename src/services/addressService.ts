import { apiClient } from '@/lib/apiClient';
import type { Address } from '@/types';

export const addressService = {
  getAll: () =>
    apiClient.get<Address[]>('/profile/addresses'),

  create: (data: Omit<Address, 'id'>) =>
    apiClient.post<Address>('/profile/addresses', data),

  update: (id: string, data: Partial<Address>) =>
    apiClient.put<Address>(`/profile/addresses/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/profile/addresses/${id}`),
};
