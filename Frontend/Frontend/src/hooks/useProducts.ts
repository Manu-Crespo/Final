import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types';
import { parseErrors } from '../utils/errorUtils';
import { productService } from '../services/productService';
import { ingredientService } from '../services/ingredientService';
import { categoryService } from '../services/categoryService';

export const useProducts = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', base_price: 0, stock_quantity: 0, available: true,
    category_ids: [] as number[], ingredient_ids: [] as number[], image_url: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmState, setConfirmState] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  const { data: ingredientsData } = useQuery({
    queryKey: ['ingredients'],
    queryFn: ingredientService.getAll,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const mutation = useMutation({
    mutationFn: async (d: any) => {
      const payload = {
        name: d.name,
        description: d.description || null,
        base_price: d.base_price,
        stock_quantity: d.stock_quantity,
        available: d.stock_quantity === 0 ? false : d.available,
        images_url: d.image_url ? [d.image_url] : null,
        category_ids: d.category_ids,
        ingredient_ids: d.ingredient_ids,
      };
      if (editing) return productService.update(editing.id, payload);
      return productService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
    onError: (err: any) => setErrors(parseErrors(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const openModal = (prod?: Product) => {
    if (prod) {
      setEditing(prod);
      setFormData({
        name: prod.name, description: prod.description || '',
        base_price: prod.base_price, stock_quantity: prod.stock_quantity,
        available: prod.available,
        category_ids: prod.categories.map(c => c.id),
        ingredient_ids: prod.ingredients.map(i => i.id),
        image_url: prod.images_url?.[0] || '',
      });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', base_price: 0, stock_quantity: 0, available: true, category_ids: [], ingredient_ids: [], image_url: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditing(null); setErrors({}); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleDelete = (id: number) => setConfirmState({ open: true, id });

  const confirmDelete = () => {
    if (confirmState.id) deleteMutation.mutate(confirmState.id);
    setConfirmState({ open: false, id: null });
  };

  const cancelDelete = () => setConfirmState({ open: false, id: null });

  const handleStockChange = (val: string) => {
    const qty = parseInt(val, 10) || 0;
    setFormData(prev => ({ ...prev, stock_quantity: qty, available: qty === 0 ? false : prev.available }));
  };

  const setFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    products: data?.data || [],
    ingredients: ingredientsData?.data || [],
    categories: categoriesData?.data || [],
    isLoading,
    isError,
    isModalOpen,
    editing,
    formData,
    errors,
    confirmState,
    mutation,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleStockChange,
    setFormField,
  };
};
