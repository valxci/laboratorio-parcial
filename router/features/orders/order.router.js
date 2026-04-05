import { Router } from "express";
import { 
    addToCart, 
    getCart, 
    checkout, 
    getOrders, 
    acceptOrder, 
    deliverOrder 
} from "./order.controller.js";

const router = Router();

router.post("/cart", addToCart); // Agregar al carrito
router.get("/cart/:userId", getCart); // Ver carrito
router.post("/checkout", checkout); // Finalizar Compra
router.get("/orders", getOrders); // Ver órdenes 
router.put("/orders/:id/accept", acceptOrder); // Aceptar orden y cambiar a on_way


export default router;
