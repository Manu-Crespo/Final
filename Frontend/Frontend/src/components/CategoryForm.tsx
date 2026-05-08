import React from 'react';
import { Category } from '../types';

interface CategoryFormProps {
  formData: {
    name: string;
    description: string;
    parent_id: number | null;
    image_url: string;
  };
  errors: Record<string, string>;
  parents: Category[];
  editingId?: number;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: string, value: any) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  formData,
  errors,
  parents,
  editingId,
  isPending,
  onSubmit,
  onFieldChange,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errors.global && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded text-xs text-danger">
          {errors.global}
        </div>
      )}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Categoría Madre</label>
        <select 
          value={formData.parent_id ?? ''} 
          onChange={e => onFieldChange('parent_id', e.target.value ? Number(e.target.value) : null)}
          className={`w-full bg-bg border ${errors.parent_id ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`}
        >
          <option value="">Sin categoría madre</option>
          {parents.filter(p => p.id !== editingId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {errors.parent_id && <p className="text-danger text-[10px] mt-1">{errors.parent_id}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={e => onFieldChange('name', e.target.value)}
          className={`w-full bg-bg border ${errors.name ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} 
        />
        {errors.name && <p className="text-danger text-[10px] mt-1">{errors.name}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Descripción</label>
        <input 
          type="text" 
          value={formData.description} 
          onChange={e => onFieldChange('description', e.target.value)}
          className={`w-full bg-bg border ${errors.description ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} 
        />
        {errors.description && <p className="text-danger text-[10px] mt-1">{errors.description}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">URL de Imagen</label>
        <input 
          type="text" 
          placeholder="https://..." 
          value={formData.image_url} 
          onChange={e => onFieldChange('image_url', e.target.value)}
          className={`w-full bg-bg border ${errors.image_url ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors mb-2`} 
        />
        {errors.image_url && <p className="text-danger text-[10px] mt-1 mb-2">{errors.image_url}</p>}
        {formData.image_url && <img src={formData.image_url} alt="preview" className="w-full h-24 object-cover rounded border border-border" />}
      </div>
      <button type="submit" className="btn btn-primary w-full mt-4 shadow-lg shadow-primary/20" disabled={isPending}>
        {isPending ? 'Guardando...' : 'Confirmar Guardado'}
      </button>
    </form>
  );
};
