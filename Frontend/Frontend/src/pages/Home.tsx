import React from 'react';
import { Link } from 'react-router-dom';
import { useHome } from '../hooks/useHome';

export const Home: React.FC = () => {
  const { available, isLoading, isError } = useHome();

  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-extrabold mb-2 text-white">Bienvenido a FoodStore</h1>
      <p className="text-text-muted mb-12 text-lg">Explora los mejores productos en nuestro catálogo</p>

      {isLoading && <p className="text-text-muted animate-pulse">Cargando productos...</p>}
      {isError && <p className="text-danger font-medium p-4 bg-danger/10 rounded">Error al cargar productos.</p>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {available.map(product => (
            <Link 
              key={product.id} 
              to={`/productos/${product.id}`}
              className="bg-surface border border-border rounded-default overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-primary/50 group no-underline text-left flex flex-col h-full"
            >
              <div className="w-full h-48 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                {product.images_url?.[0]
                  ? <img src={product.images_url[0]} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                  : <div className="text-text-muted text-sm italic">Sin imagen</div>
                }
                <div className="absolute top-2 right-2">
                  <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                    Nuevo
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-primary group-hover:text-primary-hover font-bold text-lg mb-2 transition-colors">{product.name}</h3>
                <p className="text-text-muted text-sm mb-4 line-clamp-2 flex-1">{product.description || 'Sin descripción disponible para este producto.'}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                  <span className="text-xl font-bold text-white">${product.base_price}</span>
                  <span className="bg-primary/10 text-primary-hover text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    Stock: {product.stock_quantity}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {available.length === 0 && <p className="text-text-muted col-span-full py-12 italic">No hay productos disponibles en este momento.</p>}
        </div>
      )}
    </div>
  );
};
