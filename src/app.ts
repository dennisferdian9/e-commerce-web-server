import Fastify from "fastify";

import postgresPlugin from "./plugins/postgresql";
import productRoutes from "./modules/products/product.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";
import cors from "@fastify/cors";

export const buildApp = () => {
  const app = Fastify();
  app.register(cors, {});
  app.get("/", async (request, reply) => {
    return JSON.stringify({
      message: "Welcome to E-commerce",
    });
  });
  app.get("/ping", async (request, reply) => {
    return "pong\n";
  });

  // Register PostgreSQL plugin
  app.register(postgresPlugin);
  app.register(transactionRoutes);
  // Register routes
  app.register(productRoutes);

  return app;
};
