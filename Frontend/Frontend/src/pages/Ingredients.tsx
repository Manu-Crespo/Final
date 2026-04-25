import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Ingredient, ApiResponse } from '../types';
import { parseErrors } from '../utils/errorUtils';

export const Ingredients: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_allergenic: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmState, setConfirmState] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const { data, isLoading, isError } = useQuery<IngredientResponse>({
    queryKey: ['ingredients'],
    queryFn: async () => (await api.get('/ingredients/')).data,
  });

  const mutation = useMutation({
    mutationFn: async (d: any) => {
      if (editing) return api.patch(`/ingredients/${editing.id}`, d);
      return api.post('/ingredients/', d);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredients'] }); closeModal(); },
    onError: (err: any) => setErrors(parseErrors(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/ingredients/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutation.mutate(formData); };

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

  const handleDelete = (id: number) => setConfirmState({ open: true, id });
  const confirmDelete = () => {
    if (confirmState.id) deleteMutation.mutate(confirmState.id);
    setConfirmState({ open: false, id: null });
  };

  if (isLoading) return <div className="p-8 text-text-muted animate-pulse">Cargando ingredientes...</div>;
  if (isError) return <div className="p-8 text-danger bg-danger/10 rounded">Error al cargar ingredientes.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Ingredientes</h1>
        <button className="btn btn-primary shadow-lg shadow-primary/20" onClick={() => openModal()}>+ Nuevo Ingrediente</button>
      </div>

      <div className="overflow-x-auto rounded-default border border-border shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Alérgeno</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map(ing => (
              <tr key={ing.id}>
                <td>{ing.id}</td>
                <td className="font-medium text-white">{ing.name}</td>
                <td className="text-text-muted italic">{ing.description || '-'}</td>
                <td>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${ing.is_allergenic ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ing.is_allergenic ? 'bg-warning' : 'bg-success'}`}></span>
                    {ing.is_allergenic ? '⚠ Sí' : 'No'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-sm btn-outline" onClick={() => openModal(ing)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ing.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {data?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-text-muted italic">No hay ingredientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.global && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded text-xs text-danger">
              {errors.global}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-bg border ${errors.name ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} />
            {errors.name && <p className="text-danger text-[10px] mt-1">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Descripción</label>
            <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`w-full bg-bg border ${errors.description ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} />
            {errors.description && <p className="text-danger text-[10px] mt-1">{errors.description}</p>}
          </div>
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" checked={formData.is_allergenic} onChange={e => setFormData({ ...formData, is_allergenic: e.target.checked })} 
              className="w-4 h-4 accent-primary" />
            <label className="text-sm text-text-muted font-medium">¿Es un ingrediente alérgeno?</label>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4 shadow-lg shadow-primary/20" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Confirmar Guardado'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmState.open} title="Eliminar ingrediente"
        message="¿Estás seguro de que querés eliminar este ingrediente? Esta acción no se puede deshacer."
        onConfirm={confirmDelete} onCancel={() => setConfirmState({ open: false, id: null })} />
    </div>
  );
};
