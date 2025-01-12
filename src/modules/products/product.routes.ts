import { FastifyInstance } from "fastify";
import {
  createProductHandler,
  exportProductHandler,
  getProductHandler,
  getProductListHandler,
  getProductLocalHandler,
  updateProductHandler,
} from "./product.controller";

export default async function productRoutes(app: FastifyInstance) {
  app.get("/products", getProductListHandler);
  app.get("/products/local", getProductLocalHandler);

  app.post("/product/", createProductHandler);
  app.get("/product/:id", getProductHandler);
  app.post("/product/save", exportProductHandler);

  app.patch("/product/:id", updateProductHandler);
  app.delete("/product/:id", getProductHandler);
}
