export type Product = {
  title: string;
  sku: string;
  image: string;
  price: number;
  stock: number;
  images: string[];
  thumbnail: string;
  description: string;
  id: number;
};

export type ProductAPI = {
  products: Product[];
  product: Product;
  total: number;
  skip: number;
  limit: number;
};
