import { productService } from "./product.service.js";

export const getStoreProducts = async (req, res) => {
    try {
        const storeId = req.params.id;
        const products = await productService.getStoreProducts(storeId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const storeId = req.params.id;
        const { name, price, photo } = req.body;
        const product = await productService.createProduct(storeId, name, price, photo);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
