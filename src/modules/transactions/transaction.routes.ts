import { FastifyInstance } from "fastify";
import {
  createTransactionHandler,
  deleteTransactionHandler,
  getAllTransactionHandler,
  getTransactionDetailHandler,
  updateTransactionHandler,
} from "./transaction.controller";

export default async function transactionRoutes(app: FastifyInstance) {
  app.get("/transaction/:id", getTransactionDetailHandler);
  app.post("/transaction", createTransactionHandler);

  app.get("/transactions", getAllTransactionHandler);

  app.patch("/transaction/:id", updateTransactionHandler);
  app.delete("/transaction/:id", deleteTransactionHandler);
}
