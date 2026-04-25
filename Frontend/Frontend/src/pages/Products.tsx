import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Link } from 'react-router-dom';
import { Product, Ingredient, Category, ApiResponse } from '../types';
import { parseErrors } from '../utils/errorUtils';

export const Products: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', base_price: 0, stock_quantity: 0, available: true,
    category_ids: [] as number[], ingredient_ids: [] as number[], image_url: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmState, setConfirmState] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const { data, isLoading, isError } = useQuery<ApiResponse<Product[]>>({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products/')).data,
  });

  const { data: ingredientsData } = useQuery<ApiResponse<Ingredient[]>>({
    queryKey: ['ingredients'],
    queryFn: async () => (await api.get('/ingredients/')).data,
  });

  const { data: categoriesData } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories/')).data,
  });

  const allIngredients = ingredientsData?.data || [];
  const subCategories = categoriesData?.data.filter(c => c.parent_id !== null) || [];

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
      if (editing) return api.patch(`/products/${editing.id}`, payload);
      return api.post('/products/', payload);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); closeModal(); },
    onError: (err: any) => setErrors(parseErrors(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutation.mutate(formData); };

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

  const handleDelete = (id: number) => setConfirmState({ open: true, id });
  const confirmDelete = () => {
    if (confirmState.id) deleteMutation.mutate(confirmState.id);
    setConfirmState({ open: false, id: null });
  };

  const handleStockChange = (val: string) => {
    const qty = parseInt(val, 10) || 0;
    setFormData(prev => ({ ...prev, stock_quantity: qty, available: qty === 0 ? false : prev.available }));
  };

  if (isLoading) return <div className="p-8 text-text-muted animate-pulse">Cargando productos...</div>;
  if (isError) return <div className="p-8 text-danger bg-danger/10 rounded">Error al cargar productos.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Productos</h1>
        <button className="btn btn-primary shadow-lg shadow-primary/20" onClick={() => openModal()}>+ Nuevo Producto</button>
      </div>

      <div className="overflow-x-auto rounded-default border border-border shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Disponible</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td className="w-16">
                  {prod.images_url?.[0]
                    ? <img src={prod.images_url[0]} alt={prod.name} className="w-10 h-10 object-cover rounded shadow-sm border border-border/50" />
                    : <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-[10px] text-text-muted">N/A</div>
                  }
                </td>
                <td className="font-medium text-white">
                  <Link to={`/productos/${prod.id}`} className="hover:text-primary transition-colors no-underline">
                    {prod.name}
                  </Link>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1">
                      {prod.categories.map(c => <span key={c.id} className="text-[9px] bg-primary/20 text-primary-hover px-1 rounded border border-primary/20">{c.name}</span>)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {prod.ingredients.map(i => <span key={i.id} className="text-[9px] bg-slate-700 text-text-muted px-1 rounded">{i.name}</span>)}
                    </div>
                  </div>
                </td>
                <td className="font-bold text-white">${prod.base_price}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${prod.stock_quantity > 5 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {prod.stock_quantity}
                  </span>
                </td>
                <td>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${prod.available ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${prod.available ? 'bg-success' : 'bg-danger'}`}></span>
                    {prod.available ? 'Sí' : 'No'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-sm btn-outline" onClick={() => openModal(prod)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Editar Producto' : 'Nuevo Producto'}>
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
            <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`w-full bg-bg border ${errors.description ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} />
            {errors.description && <p className="text-danger text-[10px] mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Precio Base</label>
              <input type="number" step="0.01" value={formData.base_price} onChange={e => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-bg border ${errors.base_price ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} />
              {errors.base_price && <p className="text-danger text-[10px] mt-1">{errors.base_price}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Stock</label>
              <input type="number" value={formData.stock_quantity} onChange={e => handleStockChange(e.target.value)}
                className={`w-full bg-bg border ${errors.stock_quantity ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} />
              {errors.stock_quantity && <p className="text-danger text-[10px] mt-1">{errors.stock_quantity}</p>}
              {formData.stock_quantity === 0 && !errors.stock_quantity && <small className="text-warning text-[10px] block mt-1">⚠ Se marcará como no disponible</small>}
            </div>
          </div>
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" checked={formData.available} disabled={formData.stock_quantity === 0}
              onChange={e => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 accent-primary" />
            <label className="text-sm text-text-muted font-medium">Disponible para la venta</label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Categorías</label>
              <div className="max-h-32 overflow-y-auto border border-border rounded-default p-3 bg-bg/50 space-y-1">
                {subCategories.length === 0 && <small className="text-text-muted italic">Cargando...</small>}
                {subCategories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-white/5 transition-colors px-1 rounded">
                    <input type="checkbox" className="accent-primary"
                      checked={formData.category_ids.includes(cat.id)}
                      onChange={e => {
                        const ids = e.target.checked
                          ? [...formData.category_ids, cat.id]
                          : formData.category_ids.filter(id => id !== cat.id);
                        setFormData({ ...formData, category_ids: ids });
                      }} />
                    <span className="text-[11px] text-text">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Ingredientes</label>
              <div className="max-h-32 overflow-y-auto border border-border rounded-default p-3 bg-bg/50 space-y-1">
                {allIngredients.length === 0 && <small className="text-text-muted italic">Cargando...</small>}
                {allIngredients.map(ing => (
                  <label key={ing.id} className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-white/5 transition-colors px-1 rounded">
                    <input type="checkbox" className="accent-primary"
                      checked={formData.ingredient_ids.includes(ing.id)}
                      onChange={e => {
                        const ids = e.target.checked
                          ? [...formData.ingredient_ids, ing.id]
                          : formData.ingredient_ids.filter(id => id !== ing.id);
                        setFormData({ ...formData, ingredient_ids: ids });
                      }} />
                    <span className="text-[11px] text-text">{ing.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">URL de Imagen</label>
            <input type="text" placeholder="https://..." value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              className={`w-full bg-bg border ${errors.images_url ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors mb-2`} />
            {errors.images_url && <p className="text-danger text-[10px] mt-1 mb-2">{errors.images_url}</p>}
            {formData.image_url && <img src={formData.image_url} alt="preview" className="w-full h-24 object-cover rounded border border-border" />}
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4 shadow-lg shadow-primary/20" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Confirmar Guardado'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmState.open} title="Eliminar producto"
        message="¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={confirmDelete} onCancel={() => setConfirmState({ open: false, id: null })} />
    </div>
  );
};
