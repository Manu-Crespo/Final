import React from 'react';

interface IngredientFormProps {
  formData: {
    name: string;
    description: string;
    is_allergenic: boolean;
  };
  errors: Record<string, string>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: string, value: any) => void;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({
  formData,
  errors,
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
      <div className="flex items-center gap-2 py-1">
        <input 
          type="checkbox" 
          checked={formData.is_allergenic} 
          onChange={e => onFieldChange('is_allergenic', e.target.checked)} 
          className="w-4 h-4 accent-primary" 
        />
        <label className="text-sm text-text-muted font-medium">¿Es un ingrediente alérgeno?</label>
      </div>
      <button type="submit" className="btn btn-primary w-full mt-4 shadow-lg shadow-primary/20" disabled={isPending}>
        {isPending ? 'Guardando...' : 'Confirmar Guardado'}
      </button>
    </form>
  );
};
