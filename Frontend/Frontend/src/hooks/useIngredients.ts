import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ingredient } from '../types';
import { parseErrors } from '../utils/errorUtils';
import { ingredientService } from '../services/ingredientService';

export const useIngredients = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_allergenic: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmState, setConfirmState] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ingredients'],
    queryFn: ingredientService.getAll,
  });

  const mutation = useMutation({
    mutationFn: async (d: any) => {
      if (editing) return ingredientService.update(editing.id, d);
      return ingredientService.create(d);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      closeModal();
    },
    onError: (err: any) => setErrors(parseErrors(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: ingredientService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const openModal = (ing?: Ingredient) => {
    if (ing) {
      setEditing(ing);
      setFormData({ name: ing.name, description: ing.description || '', is_allergenic: ing.is_allergenic });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', is_allergenic: false });
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

  const setFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    ingredients: data?.data || [],
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
    setFormField,
  };
};
