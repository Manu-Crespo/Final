import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id!),
    enabled: !!id,
  });

  return {
    product,
    isLoading,
    isError,
  };
};
