import { Router } from "express";
import { getStores, updateStoreStatus } from "./store.controller.js";

const router = Router();

router.get("/stores", getStores); // Ver tiendas 
router.put("/stores/:id/status", updateStoreStatus); // Abrir/cerrar tienda 

export default router;
