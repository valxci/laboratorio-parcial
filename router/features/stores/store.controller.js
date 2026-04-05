import { storeService } from "./store.service.js";

export const getStores = async (req, res) => {
    try {
        const category = req.query.category;
        const stores = await storeService.getStores(category);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateStoreStatus = async (req, res) => {
    try {
        const storeId = req.params.id;
        const { is_open } = req.body;
        const store = await storeService.updateStoreStatus(storeId, is_open);
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
