import { useState, useEffect } from "react";
import rappiLogo from "../../assets/rappiLogo.png";
import { useNavigate } from 'react-router';
import { useApp } from '../../context/App';

interface Store {
    id: number;
    name: string;
    description: string;
    adress: string;
    is_open: boolean;
    image_url?: string;
}

export default function ClientDashboard() {
    const navigate = useNavigate();
    const { handleLogout } = useApp();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch("/api/stores");
                if (res.ok) {
                    const data = await res.json();
                    setStores(data);
                }
            } catch (err) {
                console.error("Error fetching stores:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <img src={rappiLogo} alt="Rappi Logo" className="h-10 object-contain" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/client/orders")}
                                className="p-2 text-gray-500 hover:text-[#FF441F] transition-colors rounded-full cursor-pointer"
                                title="Mis Órdenes"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </button>

                            {/* Botón Carrito en Navbar */}
                            <button
                                onClick={() => navigate('/client/cart')}
                                className="flex items-center gap-1.5 p-2 px-3 text-gray-500 hover:text-[#FF441F] transition-colors rounded-full font-bold cursor-pointer"
                                title="Mi Carrito"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tiendas disponibles</h1>
                        <p className="text-gray-500 font-medium mt-2">Encuentra tus lugares favoritos para pedir</p>
                    </div>
                    <button
                        onClick={() => { handleLogout(); navigate('/'); }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-6 rounded-full text-sm transition-colors self-start sm:self-auto cursor-pointer"
                    >
                        Cerrar sesión
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF441F]"></div>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🏪</div>
                        <h3 className="text-xl font-bold text-gray-900">No hay tiendas disponibles</h3>
                        <p className="text-gray-500 mt-2">Aún no se han registrado tiendas en la plataforma.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stores.map((store) => (
                            <div
                                key={store.id}
                                onClick={() => navigate(`/client/store/${store.id}`)}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                            >
                                <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                                    <img
                                        src={store.image_url}
                                        alt={store.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${store.is_open ? "bg-green-500/90 text-white" : "bg-gray-900/80 text-white"}`}>
                                            {store.is_open ? "Abierto" : "Cerrado"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{store.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">{store.description}</p>
                                    <div className="flex items-center text-xs text-gray-400 font-medium truncate">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        <span className="truncate">{store.adress}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
