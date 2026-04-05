import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import { useApp } from '../context/App';

export default function SignUp() {
    const navigate = useNavigate();
    const { role, setUserId } = useApp();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer); // Limpiamos el timer por si el componente se desmonta o cambia el mensaje :)
        }
    }, [message]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, role }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Algo salió mal al registrar.");

            setMessage({ type: "success", text: "¡Registro completado de forma satisfactoria!" });

            const user = data.user;
            if (user?.id) setUserId(user.id);

            setTimeout(() => {
                navigate('/client');
            }, 1000);

        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row relative">

            {/* Mensaje de éxito o error :P */}
            {message && (
                <div className="toast toast-top toast-center z-50 mt-4">
                    <div className={`alert shadow-lg text-white font-bold ${message.type === "success" ? "alert-success" : "alert-error"
                        }`}>
                        <span>{message.text}</span>
                    </div>
                </div>
            )}


            <div className="w-full md:w-1/2 hidden md:block relative bg-gray-100">
                <img
                    src="https://thelogisticsworld.com/wp-content/uploads/2022/02/repartidor-de-comida-en-motocicleta.jpg"
                    alt="Comida a domicilio"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/*formulario */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-24">

                <div className="max-w-md w-full mx-auto">

                    <button
                        onClick={() => navigate('/role')}
                        className="text-gray-400 hover:text-gray-700 font-semibold text-sm mb-10 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        ← Volver
                    </button>

                    <div className="mb-10">
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Crea tu cuenta</h2>
                        <p className="text-gray-500 font-medium mt-3">Empieza a usar Rappi en menos de un minuto.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre completo</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ej: María García"
                                required
                                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#FF441F] focus:outline-none font-medium text-gray-900 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="maria@ejemplo.com"
                                required
                                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#FF441F] focus:outline-none font-medium text-gray-900 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#FF441F] focus:outline-none font-medium text-gray-900 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-[#FF441F] hover:bg-[#e63d1c] disabled:bg-gray-300 text-white font-bold text-lg rounded-xl shadow-lg shadow-[#FF441F]/30 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            {loading ? "Registrando..." : "Registrarme"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
