import { api } from '../api/api';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories/');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/categories/', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};
