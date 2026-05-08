import React from 'react';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useCategories } from '../hooks/useCategories';
import { CategoryForm } from '../components/CategoryForm';

export const Categories: React.FC = () => {
  const {
    categories,
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
  } = useCategories();

  if (isLoading) return <div className="p-8 text-text-muted animate-pulse">Cargando categorías...</div>;
  if (isError) return <div className="p-8 text-danger bg-danger/10 rounded">Error al cargar categorías.</div>;

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
            {categories.filter(c => c.parent_id !== null).map(cat => (
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
            {categories.filter(c => c.parent_id !== null).length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-text-muted italic">No hay subcategorías registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Editar Categoría' : 'Nueva Categoría'}>
        <CategoryForm 
          formData={formData}
          errors={errors}
          parents={parents}
          editingId={editing?.id}
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
          onFieldChange={setFormField}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={confirmState.open} 
        title="Eliminar categoría"
        message="¿Estás seguro de que querés eliminar esta categoría? Esta acción no se puede deshacer."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
      />
    </div>
  );
};
