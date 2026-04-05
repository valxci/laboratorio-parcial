import { Router } from "express";
import { getStoreProducts, createProduct } from "./product.controller.js";

const router = Router();

router.get("/stores/:id/products", getStoreProducts); // Ver productos de una tienda
router.post("/stores/:id/products", createProduct); // Crear productos

export default router;
