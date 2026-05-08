import React from 'react';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useIngredients } from '../hooks/useIngredients';
import { IngredientForm } from '../components/IngredientForm';

export const Ingredients: React.FC = () => {
  const {
    ingredients,
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
  } = useIngredients();

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
            {ingredients.map(ing => (
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
            {ingredients.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-text-muted italic">No hay ingredientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}>
        <IngredientForm 
          formData={formData}
          errors={errors}
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
          onFieldChange={setFormField}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={confirmState.open} 
        title="Eliminar ingrediente"
        message="¿Estás seguro de que querés eliminar este ingrediente? Esta acción no se puede deshacer."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
      />
    </div>
  );
};
