import { pool } from "../../config/db.js";

class ProductService {
    async getStoreProducts(storeId) {
        const text = 'SELECT * FROM "Products" WHERE store_id = $1';
        const result = await pool.query(text, [storeId]);
        return result.rows;
    }

    async createProduct(storeId, name, price, photo) {
        // Asignamos el ID manualmente sumándole 1 al máximo existente para evitar errores de secuencia 
        const text = 'INSERT INTO "Products" (id, store_id, name, price, photo) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM "Products"), $1, $2, $3, $4) RETURNING *';
        const result = await pool.query(text, [storeId, name, price, photo]);
        return result.rows[0];
    }
}

export const productService = new ProductService();
