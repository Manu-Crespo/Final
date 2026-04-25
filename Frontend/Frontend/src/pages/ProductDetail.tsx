import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';
import { Product } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`/products/${id}`)).data,
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-text-muted">Cargando detalles del producto...</div>;
  if (isError || !product) return <div className="p-8 text-danger">Error al cargar el producto.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Link to="/productos" className="text-primary hover:underline text-sm">← Volver a productos</Link>
      </div>

      <div className="bg-surface rounded-default border border-border overflow-hidden shadow-xl md:flex">
        <div className="md:w-1/2 bg-slate-800 flex items-center justify-center p-4">
          {product.images_url?.[0] ? (
            <img 
              src={product.images_url[0]} 
              alt={product.name} 
              className="max-w-full max-h-[400px] object-contain rounded shadow-lg" 
            />
          ) : (
            <div className="text-text-muted h-64 flex items-center">Sin imagen</div>
          )}
        </div>

        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.available ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                {product.available ? 'Disponible' : 'No disponible'}
              </span>
            </div>

            <p className="text-text-muted mb-6 text-lg leading-relaxed">
              {product.description || 'Este producto no tiene descripción disponible.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black/20 p-3 rounded">
                <span className="block text-xs text-text-muted uppercase mb-1">Precio Base</span>
                <span className="text-2xl font-bold text-primary">${product.base_price}</span>
              </div>
              <div className="bg-black/20 p-3 rounded">
                <span className="block text-xs text-text-muted uppercase mb-1">Stock disponible</span>
                <span className="text-2xl font-bold text-white">{product.stock_quantity} unidades</span>
              </div>
            </div>

            {product.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map(cat => (
                    <span key={cat.id} className="bg-primary/10 text-primary-hover px-2 py-1 rounded-full text-xs border border-primary/20">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.ingredients.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map(ing => (
                    <span key={ing.id} className="bg-slate-700 text-text px-2 py-1 rounded-full text-xs">
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
