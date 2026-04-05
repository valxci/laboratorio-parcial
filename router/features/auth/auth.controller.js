import { createUser, findUserByEmail, findStoreByOwnerId } from "./auth.service.js";

export async function registerUser(req, res) {
    const { name, email, role, storeName, adress, description } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const newUser = await createUser({ name, email, role, storeName, adress, description });
        
        let storeData = null;
        if (role === 'store') {
            storeData = await findStoreByOwnerId(newUser.id);
        }

        res.status(201).json({ message: "Usuario registrado con éxito :D", user: { ...newUser, storeId: storeData ? storeData.id : null } });
    } catch (error) {
        console.error("Error en registerUser:", error.message);
        res.status(500).json({ error: "Error al registrar el usuario :c" });
    }
}

export async function loginUser(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "El correo es obligatorio." });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "No existe una cuenta con ese correo." });
        }

        let storeData = null;
        if (user.role === 'store') {
            storeData = await findStoreByOwnerId(user.id);
        }

        res.status(200).json({ message: "Inicio de sesión exitoso", user: { ...user, storeId: storeData ? storeData.id : null } });
    } catch (error) {
        console.error("Error en loginUser:", error.message);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
}
