import { FastifyReply, FastifyRequest } from "fastify";
import {
  getProduct,
  SaveProductToDB,
  getProductList,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductFromDB,
  getAllProductFromDB,
} from "./product.service";
import { Product } from "../../types/product.type";
import { serializeProduct, serializeProductList } from "./product.utils";

export const getProductListHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { limit, skip } = req.query as { limit: string; skip: string };
  const productsResponse = await getProductList(limit, skip);
  const products = productsResponse.products.map(serializeProductList);

  return reply.send({
    status: "ok",
    statusCode: 200,
    data: {
      products,
      limit: productsResponse.limit,
      skip: productsResponse.limit,
    },
  });
};

export const getProductHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: string };
  const productResponse = await getProduct(id);
  const product = serializeProduct(productResponse);
  const productDBCount = await getProductFromDB(productResponse.sku);

  return reply.send({
    status: "ok",
    statusCode: 200,
    data: { ...product, savedInDatabase: parseInt(productDBCount) > 0 },
  });
};

export const createProductHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { title, sku, image, price, description } =
    req.body as Partial<Product>;
  if (!title?.length || !sku || !image || !price) {
    throw new Error(
      "All field (Title, SKU, Image, Price) must be provided for an create."
    );
  }
  const product = {
    ...(title ? { title } : {}),
    ...(sku ? { sku } : {}),
    ...(image ? { image } : {}),
    ...(price ? { price } : {}),
    ...(description ? { description } : {}),
  };

  const productsResponse = await createProduct();

  return reply.send({
    data: { ...productsResponse, ...product },
  });
};

export const updateProductHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: string };
  const { title, sku, thumbnail, price, description } =
    req.body as Partial<Product>;
  if (!title && !sku && !thumbnail && !price && !description) {
    throw new Error(
      "At least one field (Title, SKU, Image, Price, Description) must be provided for an update."
    );
  }
  const product = {
    ...(title ? { title } : {}),
    ...(sku ? { sku } : {}),
    ...(thumbnail ? { thumbnail } : {}),
    ...(price ? { price } : {}),
    ...(description ? { description } : {}),
  };

  const productsResponse = await updateProduct(id, product);
  const products = serializeProduct(productsResponse);

  return reply.send({
    status: "ok",
    statusCode: 200,
    data: products,
  });
};

export const deleteProductHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: string };

  const productsResponse = await deleteProduct(id);

  return reply.send({
    status: "ok",
    statusCode: 200,
    data: productsResponse,
  });
};

export const getProductLocalHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const productsResponse = await getAllProductFromDB();
  const products = productsResponse.map(serializeProduct);

  return reply.send({
    status: "ok",
    statusCode: 200,
    data: products,
  });
};

export const exportProductHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { title, sku, image, price, description, stock } = req.body as Product;
  if (!title || !sku || !image || !price || !stock) {
    throw new Error(
      "All field (Title, SKU, Image, Price) must be provided for an Export."
    );
  }
  const product = {
    title,
    sku,
    image,
    stock,
    price,
    description: description ?? "",
  };
  console.log(product);

  const saveToDBResponse = await SaveProductToDB(product);

  return reply.send({
    status: "ok",
    statusCode: 200,
    response: saveToDBResponse,
  });
};
