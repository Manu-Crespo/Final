import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Categories } from '../pages/Categories';
import { Products } from '../pages/Products';
import { Ingredients } from '../pages/Ingredients';
import { ProductDetail } from '../pages/ProductDetail';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categorias" element={<Categories />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route path="/ingredientes" element={<Ingredients />} />
    </Routes>
  );
};
