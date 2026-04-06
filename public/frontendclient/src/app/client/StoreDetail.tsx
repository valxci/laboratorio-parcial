import { useState, useEffect } from "react";
import rappiLogo from "../../assets/rappiLogo.png";
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../context/App';
import type { Product } from '../../types/types';

export default function StoreDetail() {
    const { storeId: storeIdParam } = useParams();
    const storeId = Number(storeIdParam);
    const navigate = useNavigate();
    const { handleAddToCart } = useApp();
    const [products, setProducts] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleAddToCartLocal = (product: Product) => {
        handleAddToCart(product);
        setAlertMessage(`¡Se agregó ${product.name} al carrito!`);
        setTimeout(() => setAlertMessage(null), 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeRes = await fetch('/api/stores');
                if (storeRes.ok) {
                    const stores = await storeRes.json();
                    const found = stores.find((s: any) => s.id === storeId);
                    if (found) setIsOpen(found.is_open);
                }
                const res = await fetch(`/api/stores/${storeId}/products`);
                if (res.ok) setProducts(await res.json());
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [storeId]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">


            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/client')}>
                                <img src={rappiLogo} alt="Rappi Logo" className="h-10 object-contain" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Icono de Órdenes */}
                            <button
                                onClick={() => navigate('/client/orders')}
                                className="flex items-center p-2 text-gray-500 hover:text-[#FF441F] transition-colors rounded-full cursor-pointer"
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

            {/* Alerta*/}
            {alertMessage && (
                <div className="toast toast-top toast-center z-50 mt-4">
                    <div className="alert shadow-lg text-white font-bold alert-success">
                        <span>{alertMessage}</span>
                    </div>
                </div>
            )}

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/client')}
                        className="inline-flex items-center text-gray-500 hover:text-[#FF441F] transition-colors font-medium text-sm cursor-pointer"
                    >
                        ← Volver
                    </button>
                </div>
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Menú de la Tienda</h1>
                    <p className="text-gray-500 font-medium mt-2">Elige los productos que quieres pedir</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF441F]"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🍔</div>
                        <h3 className="text-xl font-bold text-gray-900">No hay productos aún</h3>
                    </div>
                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-3xl w-full shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <figure className="relative h-48 w-full bg-gray-200 overflow-hidden">
                                    {product.photo ? (
                                        <img
                                            src={product.photo}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl">🍲</div>
                                    )}
                                </figure>

                                {/*Card del producto :P */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-black text-[#FF441F] text-2xl">${Number(product.price).toLocaleString()}</span>
                                        <button
                                            onClick={() => handleAddToCartLocal(product)}
                                            disabled={!isOpen}
                                            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm cursor-pointer ${isOpen
                                                ? "bg-[#FF441F] text-white hover:bg-[#e63d1c] shadow-[#FF441F]/30 hover:-translate-y-0.5 active:scale-95"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-75"
                                                }`}
                                        >
                                            {isOpen ? "Añadir al carrito" : "Cerrado"}
                                        </button>
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
