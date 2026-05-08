import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '../types';
import { parseErrors } from '../utils/errorUtils';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', parent_id: null as number | null, image_url: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmState, setConfirmState] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const mutation = useMutation({
    mutationFn: async (d: any) => {
      const payload = { ...d, parent_id: d.parent_id || null, image_url: d.image_url || null };
      if (editing) return categoryService.update(editing.id, payload);
      return categoryService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: (err: any) => setErrors(parseErrors(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditing(cat);
      setFormData({ name: cat.name, description: cat.description || '', parent_id: cat.parent_id, image_url: cat.image_url || '' });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', parent_id: null, image_url: '' });
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

  const all = data?.data || [];
  const parents = all.filter(c => c.parent_id === null);

  return {
    categories: all,
    parents,
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
