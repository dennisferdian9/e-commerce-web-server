import { Product } from "../../types/product.type";

export const serializeProductList = (product: Product) => {
  return {
    title: product.title,
    image: product.thumbnail,
    sku: product.sku,
    price: product.price,
    Stock: product.stock,
    id: product.id,
  };
};
export const serializeProduct = (product: Product) => {
  console.log(product.title);
  return {
    title: product.title,
    image: product.thumbnail,
    sku: product.sku,
    price: product.price,
    stock: product.stock,
    description: product.description,
    id: product.id,
  };
};
