import React from 'react';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductForm } from '../components/ProductForm';

export const Products: React.FC = () => {
  const {
    products,
    categories,
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
    handleStockChange,
    setFormField,
  } = useProducts();

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
            {products.map(prod => (
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
        <ProductForm 
          formData={formData}
          errors={errors}
          categories={categories}
          ingredients={ingredients}
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
          onFieldChange={setFormField}
          onStockChange={handleStockChange}
        />
      </Modal>

      <ConfirmDialog 
        isOpen={confirmState.open} 
        title="Eliminar producto"
        message="¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
      />
    </div>
  );
};
