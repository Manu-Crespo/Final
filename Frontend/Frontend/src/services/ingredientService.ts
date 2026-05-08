import { api } from '../api/api';
import { Ingredient, ApiResponse } from '../types';

export const ingredientService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Ingredient[]>>('/ingredients/');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/ingredients/', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/ingredients/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  }
};
