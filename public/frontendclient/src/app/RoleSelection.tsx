import { useState } from "react";
import { useNavigate } from 'react-router';
import { useApp } from '../context/App';

const roles = [
    {
        id: "client",
        label: "Cliente",
        emoji: "🛍️",
        description: "Pide comida y productos a domicilio",
    },
    {
        id: "store",
        label: "Tienda",
        emoji: "🏪",
        description: "Publica y vende tus productos",
    },
    {
        id: "delivery",
        label: "Repartidor",
        emoji: "🛵",
        description: "Entrega pedidos y gana dinero",
    },
];

export default function RoleSelection() {
    const [selected, setSelected] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setRole } = useApp();

    const handleRoleSelected = (role: string) => {
        setRole(role);
        if (role === 'store') navigate('/signup/store');
        else navigate('/signup');
    };

    const onBack = () => navigate('/');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16 relative">
            <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-gray-700 font-semibold text-sm flex items-center gap-1 transition-colors cursor-pointer"
                >
                    ← Volver al Inicio
                </button>
            </div>

            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight text-center">
                ¿Quién eres?
            </h1>
            <p className="text-gray-500 font-medium mb-12 text-center text-lg">
                Elige tu rol para comenzar tu registro en Rappi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => setSelected(role.id)}
                        className={`
                            rounded-3xl p-8 text-left border-2 transition-all duration-200 shadow-sm
                            hover:shadow-xl hover:-translate-y-1 cursor-pointer
                            ${selected === role.id
                                ? "border-[#FF441F] bg-[#FF441F]/5 shadow-lg shadow-[#FF441F]/10"
                                : "border-gray-200 bg-white"
                            }
                        `}
                    >
                        <div className="text-5xl mb-4">{role.emoji}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{role.label}</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{role.description}</p>
                    </button>
                ))}
            </div>

            <button
                onClick={() => selected && handleRoleSelected(selected)}
                disabled={!selected}
                className={`
                    mt-10 px-12 py-4 font-bold text-lg rounded-full shadow-xl transition-all duration-200
                    ${selected
                        ? "bg-[#FF441F] hover:bg-[#e63d1c] text-white shadow-[#FF441F]/30 hover:-translate-y-1 cursor-pointer"
                        : "bg-gray-300 text-gray-500 shadow-none cursor-not-allowed"
                    }
                `}
            >
                Continuar
            </button>
        </div>
    );
}
