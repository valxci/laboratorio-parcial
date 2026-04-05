import { pool } from "../../config/db.js";

class StoreService {
    async getStores(category) {
        if (category) {
            const text = `
                SELECT s.* FROM "Store" s
                JOIN "Store_Categories" sc ON s.id = sc.store_id
                JOIN "Categories" c ON sc.category_id = c.id
                WHERE c.name = $1
            `;
            const result = await pool.query(text, [category]);
            return result.rows;
        } else {
            const result = await pool.query('SELECT * FROM "Store"');
            return result.rows;
        }
    }

    async updateStoreStatus(storeId, isOpen) {
        const text = 'UPDATE "Store" SET is_open = $1 WHERE id = $2 RETURNING *';
        const result = await pool.query(text, [isOpen, storeId]);
        return result.rows[0];
    }
}

export const storeService = new StoreService();
