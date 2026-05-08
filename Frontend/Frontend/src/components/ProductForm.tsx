import React from 'react';
import { Category, Ingredient } from '../types';

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    base_price: number;
    stock_quantity: number;
    available: boolean;
    category_ids: number[];
    ingredient_ids: number[];
    image_url: string;
  };
  errors: Record<string, string>;
  categories: Category[];
  ingredients: Ingredient[];
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: string, value: any) => void;
  onStockChange: (val: string) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  errors,
  categories,
  ingredients,
  isPending,
  onSubmit,
  onFieldChange,
  onStockChange,
}) => {
  const subCategories = categories.filter(c => c.parent_id !== null);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errors.global && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded text-xs text-danger">
          {errors.global}
        </div>
      )}
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
        <textarea 
          rows={2} 
          value={formData.description} 
          onChange={e => onFieldChange('description', e.target.value)}
          className={`w-full bg-bg border ${errors.description ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} 
        />
        {errors.description && <p className="text-danger text-[10px] mt-1">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Precio Base</label>
          <input 
            type="number" 
            step="0.01" 
            value={formData.base_price} 
            onChange={e => onFieldChange('base_price', parseFloat(e.target.value) || 0)}
            className={`w-full bg-bg border ${errors.base_price ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} 
          />
          {errors.base_price && <p className="text-danger text-[10px] mt-1">{errors.base_price}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Stock</label>
          <input 
            type="number" 
            value={formData.stock_quantity} 
            onChange={e => onStockChange(e.target.value)}
            className={`w-full bg-bg border ${errors.stock_quantity ? 'border-danger' : 'border-border'} rounded-default p-2 text-text focus:outline-none focus:border-primary transition-colors`} 
          />
          {errors.stock_quantity && <p className="text-danger text-[10px] mt-1">{errors.stock_quantity}</p>}
          {formData.stock_quantity === 0 && !errors.stock_quantity && <small className="text-warning text-[10px] block mt-1">⚠ Se marcará como no disponible</small>}
        </div>
      </div>
      <div className="flex items-center gap-2 py-1">
        <input 
          type="checkbox" 
          checked={formData.available} 
          disabled={formData.stock_quantity === 0}
          onChange={e => onFieldChange('available', e.target.checked)}
          className="w-4 h-4 accent-primary" 
        />
        <label className="text-sm text-text-muted font-medium">Disponible para la venta</label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Categorías</label>
          <div className="max-h-32 overflow-y-auto border border-border rounded-default p-3 bg-bg/50 space-y-1">
            {subCategories.length === 0 && <small className="text-text-muted italic">Cargando...</small>}
            {subCategories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-white/5 transition-colors px-1 rounded">
                <input 
                  type="checkbox" 
                  className="accent-primary"
                  checked={formData.category_ids.includes(cat.id)}
                  onChange={e => {
                    const ids = e.target.checked
                      ? [...formData.category_ids, cat.id]
                      : formData.category_ids.filter(id => id !== cat.id);
                    onFieldChange('category_ids', ids);
                  }} 
                />
                <span className="text-[11px] text-text">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Ingredientes</label>
          <div className="max-h-32 overflow-y-auto border border-border rounded-default p-3 bg-bg/50 space-y-1">
            {ingredients.length === 0 && <small className="text-text-muted italic">Cargando...</small>}
            {ingredients.map(ing => (
              <label key={ing.id} className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-white/5 transition-colors px-1 rounded">
                <input 
                  type="checkbox" 
                  className="accent-primary"
                  checked={formData.ingredient_ids.includes(ing.id)}
                  onChange={e => {
                    const ids = e.target.checked
                      ? [...formData.ingredient_ids, ing.id]
                      : formData.ingredient_ids.filter(id => id !== ing.id);
                    onFieldChange('ingredient_ids', ids);
                  }} 
                />
                <span className="text-[11px] text-text">{ing.name}</span>
              </label>
            ))}
          </div>
        </div>
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
