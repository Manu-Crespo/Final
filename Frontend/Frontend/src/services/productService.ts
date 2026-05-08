import { api } from '../api/api';
import { Product, ApiResponse } from '../types';

export const productService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Product[]>>('/products/');
    return response.data;
  },
  
  getById: async (id: string | number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/products/', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
