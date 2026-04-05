import express from "express"
import cors from "cors"
import StoreRouter from "./router/features/stores/store.router.js"
import ProductRouter from "./router/features/products/product.router.js"
import OrderRouter from "./router/features/orders/order.router.js"
import AuthRouter from "./router/features/auth/auth.router.js"
import path from "path"



const PORT = 8080; // El puerto donde va a estar el servidor.

const __dirname = import.meta.dirname; // la carpeta donde se encuentra el archivo que se está ejecutando en ese momento.
const app = express();

app.use(cors())
app.use(express.json()) // nuestra informacion va a ser enviada en formato json
app.use("/api", StoreRouter)
app.use("/api", ProductRouter)
app.use("/api", OrderRouter)
app.use("/api", AuthRouter)
app.get("/favicon.ico", (req, res) => res.status(204).end());
// --- CONEXIÓN DE FRONTEND EN PRODUCCIÓN ---
// Esto sirve los archivos compilados de Vite (cuando haces npm run build)
const frontendPath = path.join(__dirname, "public", "frontendclient", "dist");
app.use(express.static(frontendPath));

// Cualquier ruta que no sea de la API (/api/...) redirige a tu frontend de React
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
    console.log("El servidor esta corriendo en el puerto :P", PORT)
})
