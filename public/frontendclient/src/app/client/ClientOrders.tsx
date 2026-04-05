import rappiLogo from "../../assets/rappiLogo.png";
import { useNavigate } from 'react-router';
import { useApp } from '../../context/App';
import type { CartItem } from '../../types/types';


export default function ClientOrders() {
    const navigate = useNavigate();
    const { orders } = useApp();
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
                            {/* Icono de Órdenes (Inactivo porque ya estamos aquí) */}
                            <div
                                className="flex items-center p-2 text-[#FF441F] rounded-full"
                                title="Mis Órdenes"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </div>
                            {/* Icono de Carrito */}
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
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mis Ordenes</h1>
                    <p className="text-gray-500 font-medium mt-2">Historial de tus pedidos recientes</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🧾</div>
                        <h3 className="text-xl font-bold text-gray-900">Aún no tienes órdenes</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-full mb-2">Completado</span>
                                        <h3 className="font-black text-lg text-gray-900">Pedido</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total pagado</p>
                                        <p className="font-black text-2xl text-[#FF441F]">${order.total.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Detalle del pedido</h4>
                                    <ul className="space-y-3">
                                        {order.items.map((item: CartItem, index: number) => (
                                            <li key={index} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{item.quantity}x</span>
                                                    <span className="font-medium text-gray-700">{item.product.name}</span>
                                                </div>
                                                <span className="text-gray-500">${(Number(item.product.price) * item.quantity).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Dirección: {order.address}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Pagó con: {order.paymentMethod}</span>
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
