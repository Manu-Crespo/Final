import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Category, ApiResponse } from '../types';
import { parseErrors } from '../utils/errorUtils';

export const Categories: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', parent_id: null as number | null, image_url: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmState, setConfirmState] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const { data, isLoading, isError } = useQuery<CategoryResponse>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories/')).data,
  });

  const mutation = useMutation({
    mutationFn: async (d: any) => {
      const payload = { ...d, parent_id: d.parent_id || null, image_url: d.image_url || null };
      if (editing) return api.patch(`/categories/${editing.id}`, payload);
      return api.post('/categories/', payload);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal(); },
    onError: (err: any) => setErrors(parseErrors(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutation.mutate(formData); };

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

  const handleDelete = (id: number) => setConfirmState({ open: true, id });
  const confirmDelete = () => {
    if (confirmState.id) deleteMutation.mutate(confirmState.id);
    setConfirmState({ open: false, id: null });
  };

  if (isLoading) return <div className="p-8 text-text-muted animate-pulse">Cargando categorías...</div>;
  if (isError) return <div className="p-8 text-danger bg-danger/10 rounded">Error al cargar categorías.</div>;

  const all = data?.data || [];
  const parents = all.filter(c => c.parent_id === null);
  const parentName = (pid: number | null) => parents.find(p => p.id === pid)?.name || '-';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Categorías</h1>
        <button className="btn btn-primary shadow-lg shadow-primary/20" onClick={() => openModal()}>+ Nueva Categoría</button>
      </div>

      <div className="overflow-x-auto rounded-default border border-border shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {all.filter(c => c.parent_id !== null).map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td className="w-16">
                  {cat.image_url
                    ? <img src={cat.image_url} alt={cat.name} className="w-10 h-10 object-cover rounded shadow-sm border border-border/50" />
                    : <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-[10px] text-text-muted">N/A</div>
                  }
                </td>
                <td className="font-medium text-white">{cat.name}</td>
                <td>
                  <span className="bg-primary/10 text-primary-hover px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-primary/20">
                    {parentName(cat.parent_id)}
                  </span>
                </td>
                <td className="text-text-muted italic">{cat.description || '-'}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-sm btn-outline" onClick={() => openModal(cat)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {all.filter(c => c.parent_id !== null).length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-text-muted italic">No hay subcategorías registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Editar Categoría' : 'Nueva Categoría'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.global && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded text-xs text-danger">
              {errors.global}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Categoría Madre</label>
            <select value={formData.parent_id ?? ''} onChange={e => setFormData({ ...formData, parent_id: e.target.value ? Number(e.target.value) : null })}
              className={`w-full bg-bg border ${errors.parent_id ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`}>
              <option value="">Sin categoría madre</option>
              {parents.filter(p => p.id !== editing?.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.parent_id && <p className="text-danger text-[10px] mt-1">{errors.parent_id}</p>}
          </div>
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
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">URL de Imagen</label>
            <input type="text" placeholder="https://..." value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              className={`w-full bg-bg border ${errors.image_url ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors mb-2`} />
            {errors.image_url && <p className="text-danger text-[10px] mt-1 mb-2">{errors.image_url}</p>}
            {formData.image_url && <img src={formData.image_url} alt="preview" className="w-full h-24 object-cover rounded border border-border" />}
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4 shadow-lg shadow-primary/20" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Confirmar Guardado'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmState.open} title="Eliminar categoría"
        message="¿Estás seguro de que querés eliminar esta categoría? Esta acción no se puede deshacer."
        onConfirm={confirmDelete} onCancel={() => setConfirmState({ open: false, id: null })} />
    </div>
  );
};
