import { db } from "../../plugins/postgresql";
import { Transaction } from "../../types/transaction.type";

export const createTransaction = async (sku: string, quantity: number) => {
  try {
    const result = await db.tx(async (t) => {
      const product = await t.oneOrNone(
        "SELECT stock FROM products WHERE sku = $1 FOR UPDATE",
        [sku]
      );

      if (!product || product.stock < quantity) {
        throw new Error("Insufficient stock or product not found.");
      }

      // Update stock in the products table
      await t.none("UPDATE products SET stock = stock - $1 WHERE sku = $2", [
        quantity,
        sku,
      ]);

      const insertedTransaction = await t.one<Transaction>(
        `INSERT INTO transactions (sku, qty)
         VALUES ($1, $2)
         RETURNING *`,
        [sku, quantity]
      );

      return insertedTransaction;
    });
    return result;
  } catch (error) {
    console.error("Error get product:", error);
    throw new Error("Failed to get product ");
  }
};

export const getTransactionDetail = async (id: number) => {
  try {
    const transaction = await db.one<Transaction>(
      `SELECT sku, qty AS quantity, id, created_at FROM transactions 
       WHERE id = $1
       `,
      [id]
    );

    return transaction;
  } catch (error) {
    console.error("Error get product:", error);
    throw new Error("Failed to get product ");
  }
};

export const getTransactionList = async (
  sku: string | null,
  limit: number,
  lastId: number | null
) => {
  try {
    let query = "SELECT sku, qty AS quantity, id, created_at FROM transactions";
    const params: (string | number)[] = [];

    if (sku) {
      query += " WHERE sku = $1";
      params.push(sku);
    }

    if (lastId !== null) {
      const idCondition = "id > $" + (params.length + 1);
      query += sku ? ` AND ${idCondition}` : ` WHERE ${idCondition}`;
      params.push(lastId);
    }

    query += " ORDER BY id ASC LIMIT $" + (params.length + 1);
    params.push(limit);

    const transactions = await db.any(query, params);

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
};

export const updateTransaction = async (
  transactionId: number,
  sku?: string,
  newQuantity?: number
) => {
  try {
    const result = await db.tx(async (t) => {
      if (!newQuantity) {
        const updatedTransaction = await t.one(
          `UPDATE transactions
           SET sku = $1
           WHERE id = $2
           RETURNING *`,
          [newQuantity, transactionId]
        );

        return updatedTransaction;
      }
      const transaction = await t.oneOrNone(
        "SELECT sku, qty AS quantity, id FROM transactions WHERE id = $1 FOR UPDATE",
        [transactionId]
      );
      if (!transaction) {
        throw new Error(`Transaction with ID '${transactionId}' not found.`);
      }

      const quantityDifference = newQuantity - transaction.qty;
      const product = await t.oneOrNone(
        "SELECT stock FROM products WHERE sku = $1 FOR UPDATE",
        [transaction.sku]
      );

      if (!product) {
        throw new Error(`Product with SKU '${sku}' not found.`);
      }

      if (product.stock - quantityDifference < 0) {
        throw new Error("Insufficient stock for this update.");
      }

      await t.none("UPDATE products SET stock = stock + $1 WHERE sku = $2", [
        quantityDifference,
        sku,
      ]);

      const updatedTransactionRes = await t.one(
        `UPDATE transactions
         SET sku = $1, qty = $2
         WHERE id = $3
         RETURNING *`,
        [sku ?? transaction.sku, newQuantity, transactionId]
      );

      return updatedTransactionRes;
    });
    return result;
  } catch (error: any) {
    console.error("Error get product:", error);
    throw new Error(error.message);
  }
};

export const deleteTransaction = async (transactionID: number) => {
  try {
    const deleteResponse = await db.none(
      `DELETE transactions
       WHERE id = $1
       RETURNING *`,
      [transactionID]
    );
    return deleteResponse;
  } catch (error) {}
};
