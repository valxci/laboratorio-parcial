import { orderService } from "./order.service.js";

export const addToCart = async (req, res) => {
    try {
        const { user_id, product_id, amount } = req.body;
        const item = await orderService.addToCart(user_id, product_id, amount);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cartItems = await orderService.getCart(userId);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const checkout = async (req, res) => {
    try {
        const { user_id, items, total, address, paymentMethod } = req.body;
        const orderId = await orderService.checkout(user_id, items, total, address, paymentMethod);
        res.status(201).json({ message: "Compra finalizada con éxito", orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { status, client_id, delivery_id } = req.query;
        const orders = await orderService.getOrders(status, client_id, delivery_id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const acceptOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { delivery_id } = req.body; // Se espera en el body el ID del repartidor
        const order = await orderService.acceptOrder(orderId, delivery_id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deliverOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.deliverOrder(orderId);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
