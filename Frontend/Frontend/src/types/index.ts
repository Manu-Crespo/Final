export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  description: string | null;
  image_url: string | null;
}

export interface Ingredient {
  id: number;
  name: string;
  description: string | null;
  is_allergenic: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  images_url: string[] | null;
  stock_quantity: number;
  available: boolean;
  categories: Category[];
  ingredients: Ingredient[];
}

export interface ApiResponse<T> {
  data: T;
  total: number;
}
