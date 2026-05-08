import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useHome = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  const available = data?.data.filter(p => p.available) || [];

  return {
    available,
    isLoading,
    isError,
  };
};
