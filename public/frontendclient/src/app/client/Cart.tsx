import { useState, useEffect } from "react";
import rappiLogo from "../../assets/rappiLogo.png";
import { useNavigate } from 'react-router';
import { useApp } from '../../context/App';

export default function Cart() {
    const navigate = useNavigate();
    const { cart, setCart, setOrders, userId } = useApp();
    const cartItems = cart;
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Efectivo");

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const total = cartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        setShowModal(true);
    };

    const handleConfirmPurchase = async () => {
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, items: cart, total, address, paymentMethod })
            });
            if (res.ok) {
                setMessage({ type: 'success', text: '¡Tu pedido ha sido confirmado! Pronto estará en camino.' });
                fetch(`/api/orders?client_id=${userId}`)
                    .then(r => r.json())
                    .then(data => setOrders(Array.isArray(data) ? data : []));
                setCart([]);
                setTimeout(() => navigate('/client'), 3000);
            } else {
                setMessage({ type: 'error', text: 'Error al confirmar el pedido.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Error de conexión.' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">

            {message && (
                <div className="toast toast-top toast-center z-50 mt-20">
                    <div className={`alert shadow-lg text-white font-bold px-6 py-4 rounded-2xl ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                        <span>{message.text}</span>
                    </div>
                </div>
            )}


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
                            {/* Icono de Carrito (Inactivo) */}
                            <div
                                className="flex items-center gap-1.5 p-2 px-3 text-[#FF441F] rounded-full font-bold"
                                title="Mi Carrito"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

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
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tu Carrito</h1>
                    <p className="text-gray-500 font-medium mt-2">Revisa tus productos antes de finalizar la compra</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🛒</div>
                        <h3 className="text-xl font-bold text-gray-900">Tu carrito está vacío</h3>
                        <p className="text-gray-500 mt-2">¡Agrega algunos platillos deliciosos para empezar!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <ul className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <li key={item.product.id} className="py-6 flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                                        {item.product.photo ? (
                                            <img src={item.product.photo} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🍲</div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                                        <p className="text-gray-500 font-medium">${Number(item.product.price).toLocaleString()} c/u</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0))}
                                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-bold text-lg text-black">{item.quantity}</span>
                                        <button
                                            onClick={() => setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity + 1 } : i))}
                                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right sm:w-24 mt-2 sm:mt-0 flex flex-col items-end gap-2">
                                        <span className="block text-xl font-black text-[#FF441F]">
                                            ${(Number(item.product.price) * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                            title="Eliminar producto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="text-center sm:text-left">
                                <p className="text-gray-500 font-medium mb-1">Total a pagar</p>
                                <p className="text-3xl font-black text-gray-900">${total.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full sm:w-auto bg-[#FF441F] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e63d1c] transition-colors shadow-lg shadow-[#FF441F]/30 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Pop-up de Pago y Dirección */}
            {showModal && (
                <div className="modal modal-open bg-black/40 backdrop-blur-sm z-[100]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowModal(false);
                            handleConfirmPurchase();
                        }}
                        className="modal-box bg-white rounded-3xl p-8 max-w-md w-full scale-100 transition-all"
                    >
                        <h3 className="font-black text-2xl text-gray-900 mb-2">Detalles de Entrega</h3>
                        <p className="text-gray-500 font-medium text-sm mb-6">Ya casi terminamos tu pedido por ${total.toLocaleString()}</p>

                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Dirección de entrega</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Ej: Calle 123 #45-67 apt 101"
                                    required
                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#FF441F] focus:outline-none font-medium text-gray-900 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Método de pago</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Efectivo', 'Tarjeta', 'Transferencia'].map(method => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method)}
                                            className={`py-3 px-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${paymentMethod === method
                                                ? 'bg-[#FF441F] text-white shadow-md shadow-[#FF441F]/30 scale-[1.02]'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action mt-8 flex gap-3">
                            <button
                                type="button"
                                className="flex-1 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-4 rounded-xl font-bold text-white bg-[#FF441F] hover:bg-[#e63d1c] transition-colors shadow-lg shadow-[#FF441F]/30 disabled:bg-gray-300 disabled:shadow-none cursor-pointer"
                            >
                                Finalizar compra
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
