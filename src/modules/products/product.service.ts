import { Product, ProductAPI } from "../../types/product.type";
import { db } from "../../plugins/postgresql";

export const getProductList = async (
  limit: string = "8",
  skip: string = "0"
): Promise<ProductAPI> => {
  try {
    const productsResponse = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    ).then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching products: ${res.statusText}`);
      }
      return res.json();
    });

    return productsResponse;
  } catch (error) {
    throw new Error("Failed to fetch product list");
  }
};

export const getProduct = async (id: string = "1"): Promise<Product> => {
  try {
    const productResponse = await fetch(
      `https://dummyjson.com/products/${id}`
    ).then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching products: ${res.statusText}`);
      }
      return res.json();
    });

    return productResponse;
  } catch (error) {
    throw new Error("Failed to fetch product list");
  }
};

export const createProduct = async (): Promise<Product> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching products: ${res.statusText}`);
      }
      return res.json();
    });

    return response;
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    throw new Error("Failed to create product in external API");
  }
};

// Update an existing product via the external API
export const updateProduct = async (
  id: string,
  product: Partial<Product>
): Promise<Product> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching products: ${res.statusText}`);
      }
      return res.json();
    });

    return response;
  } catch (error: any) {
    console.error("Error updating product:", error.message);
    throw new Error("Failed to update product in external API");
  }
};

// Delete a product via the external API
export const deleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching products: ${res.statusText}`);
      }
      return res.json();
    });

    return response;
  } catch (error: any) {
    console.error("Error deleting product:", error.message);
    throw new Error("Failed to delete product in external API");
  }
};

export const SaveProductToDB = async (
  product: Partial<Product>
): Promise<Product> => {
  try {
    try {
      const insertedProduct = await db.one<Product>(
        `INSERT INTO products (title, image, sku, price, stock, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          product.title,
          product.image,
          product.sku,
          product.price,
          product.stock,
          product.description,
        ]
      );
      console.log(insertedProduct);
      return insertedProduct;
    } catch (dbError: any) {
      console.log(dbError);
      if (dbError.code === "23505") {
        const updatedProduct = await db.one<Product>(
          `UPDATE products
           SET title = $1,
               image = $2,
               price = $3,
               stock = $4,
               description = $5
           WHERE sku = $6
           RETURNING *`,
          [
            product.title,
            product.image,
            product.price,
            product.stock,
            product.description,
            product.sku,
          ]
        );
        return updatedProduct;
      }

      throw new Error("Failed to insert product into the database.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch product list");
  }
};

export const getProductFromDB = async (sku: string) => {
  try {
    const productResponse = await db.one<{ count: string }>(
      `SELECT COUNT(*) FROM products 
       WHERE sku= $1
       `,
      [sku]
    );
    return productResponse.count;
  } catch (error) {
    console.error("Error get product:", error);
    throw new Error("Failed to get product ");
  }
};

export const getAllProductFromDB = async () => {
  try {
    const productResponse = await db.many<Product>(
      `SELECT * FROM products LIMIT 10
       `
    );
    return productResponse;
  } catch (error) {
    console.error("Error get product:", error);
    throw new Error("Failed to get product ");
  }
};
