import { pool } from "../../config/db.js";

export async function createUser({ name, email, role, storeName, adress, description, image_url }) {
    // Insertamos al usuario en la tabla principal :P
    const userResult = await pool.query(
        `INSERT INTO "users" (name, email, role) VALUES ($1, $2, $3) RETURNING *`,
        [name, email, role]
    );

    const newUser = userResult.rows[0];

    // Si el usuario que se registró era una tienda, hacemos la inserción en la tabla Store :)
    if (role === 'store') {
        const score = 0.0;
        const is_open = false; // Por defecto creamos la tienda cerrada :D

        await pool.query(
            `INSERT INTO "Store" (owner_id, name, description, adress, score, is_open, image_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [newUser.id, storeName, description, adress, score, is_open, image_url]
        );
    }

    return newUser;
}

export async function findUserByEmail(email) {
    const result = await pool.query(`SELECT * FROM "users" WHERE email = $1`, [email]);
    return result.rows[0];
}

export async function findStoreByOwnerId(userId) {
    const result = await pool.query(`SELECT * FROM "Store" WHERE owner_id = $1`, [userId]);
    return result.rows[0];
}
