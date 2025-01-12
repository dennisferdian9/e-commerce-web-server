import { FastifyReply, FastifyRequest } from "fastify";
import { Transaction } from "../../types/transaction.type";
import {
  createTransaction,
  deleteTransaction,
  getTransactionDetail,
  getTransactionList,
  updateTransaction,
} from "./transaction.service";

export const getAllTransactionHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { sku } = req.query as { sku?: string };
  const { limit = 8, lastid = null } = req.query as {
    limit: number;
    lastid: number;
  };

  const transactionResponse = await getTransactionList(
    sku ?? null,
    limit,
    lastid
  );
  return reply.send({
    status: "ok",
    statusCode: 200,
    data: transactionResponse,
  });
};

export const getTransactionDetailHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: number };
  if (!id) {
    throw new Error("id must be provided");
  }
  const transactionResponse = await getTransactionDetail(id);
  return reply.send({
    status: "ok",
    statusCode: 200,
    data: transactionResponse,
  });
};

export const createTransactionHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { sku, quantity } = req.body as Partial<Transaction>;
  if (!quantity || !sku) {
    throw new Error(
      "All field ( SKU, quantity) must be provided for an create."
    );
  }

  const transactionResponse = await createTransaction(sku, quantity);

  return reply.send({
    status: "ok",
    statusCode: 200,
    data: transactionResponse,
  });
};

export const updateTransactionHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: number };
  if (!id) {
    throw new Error("id must be provided");
  }
  const { sku, quantity } = req.body as Partial<Transaction>;
  if (!quantity && !sku) {
    throw new Error(
      "All field ( SKU, quantity) must be provided for an create."
    );
  }

  const transactionResponse = await updateTransaction(id, sku, quantity);

  return reply.send({
    status: "ok",
    statusCode: 200,
    data: transactionResponse,
  });
};

export const deleteTransactionHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: number };
  if (!id) {
    throw new Error("id must be provided");
  }
  const transactionResponse = await deleteTransaction(id);
  return reply.send({
    status: "ok",
    statusCode: 200,
    data: transactionResponse,
  });
};
