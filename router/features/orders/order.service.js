import { pool } from "../../config/db.js";

class OrderService {
    async addToCart(userId, productId, amount) {
        const text = 'INSERT INTO "Cart" (user_id, product_id, amount) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(text, [userId, productId, amount]);
        return result.rows[0];
    }

    async getCart(userId) {
        const text = 'SELECT * FROM "Cart" WHERE user_id = $1';
        const result = await pool.query(text, [userId]);
        return result.rows;
    }

    async checkout(userId, items, total, address, paymentMethod) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            if (!items || items.length === 0) {
                throw new Error("El carrito está vacío");
            }

            const orderInsert = await client.query(
                `INSERT INTO "Order" (client_id, status, total, address, "paymentMethod") VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [userId, 'pending', total, address, paymentMethod]
            );
            const orderId = orderInsert.rows[0].id;

            for (let item of items) {
                await client.query(
                    `INSERT INTO "Products_by_order" (order_id, product_id, quantity) VALUES ($1, $2, $3)`,
                    [orderId, item.product.id, item.quantity]
                );
            }

            await client.query('COMMIT');
            return orderId;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async getOrders(status, clientId, deliveryId) {
        let text = 'SELECT * FROM "Order" WHERE 1=1';
        let values = [];
        let paramsCount = 1;

        if (status) {
            text += ` AND status = $${paramsCount}`;
            values.push(status);
            paramsCount++;
        }
        if (clientId) {
            text += ` AND client_id = $${paramsCount}`;
            values.push(clientId);
            paramsCount++;
        }
        if (deliveryId) {
            text += ` AND delivery_id = $${paramsCount}`;
            values.push(deliveryId);
            paramsCount++;
        }

        const result = await pool.query(text, values);
        const orders = result.rows;

        // Anexar los productos (items) de cada orden
        for (let order of orders) {
            const itemsRes = await pool.query(`
                SELECT p.id, p.name, p.price, po.quantity 
                FROM "Products_by_order" po
                JOIN "Products" p ON po.product_id = p.id
                WHERE po.order_id = $1
            `, [order.id]);

            order.items = itemsRes.rows.map(row => ({
                product: {
                    id: row.id,
                    name: row.name,
                    price: row.price
                },
                quantity: row.quantity
            }));

            // Adaptar nombres para el frontend React
            order.paymentMethod = order.paymentMethod;
            order.date = order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Reciente';
        }

        return orders;
    }

    async acceptOrder(orderId, deliveryId) {
        const text = `UPDATE "Order" SET delivery_id = $1, status = 'on_way' WHERE id = $2 RETURNING *`;
        const result = await pool.query(text, [deliveryId, orderId]);
        return result.rows[0];
    }

    async deliverOrder(orderId) {
        const text = `UPDATE "Order" SET status = 'delivered' WHERE id = $1 RETURNING *`;
        const result = await pool.query(text, [orderId]);
        return result.rows[0];
    }
}

export const orderService = new OrderService();
