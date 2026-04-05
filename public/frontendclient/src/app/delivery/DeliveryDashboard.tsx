import { useState, useEffect } from "react";
import rappiLogo from "../../assets/rappiLogo.png";
import { useNavigate } from 'react-router';
import { useApp } from '../../context/App';
import type { Order, CartItem } from '../../types/types';

export default function DeliveryDashboard() {
    const navigate = useNavigate();
    const { userId, handleLogout } = useApp();
    const driverId = userId;
    const [activeTab, setActiveTab] = useState<'available' | 'myOrders'>('available');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = "/api/orders?status=pending";
            if (activeTab === 'myOrders') {
                url = `/api/orders?delivery_id=${driverId}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const handleAcceptOrder = async (orderId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/accept`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ delivery_id: driverId })
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (err) {
            console.error("Error accepting order:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <img src={rappiLogo} alt="Rappi Logo" className="h-10 object-contain" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Repartidor</h1>
                        <p className="text-gray-500 font-medium mt-2">Gestiona las entregas.</p>
                    </div>
                    <button
                        onClick={() => { handleLogout(); navigate('/'); }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full text-sm transition-colors cursor-pointer"
                    >
                        Cerrar sesión
                    </button>
                </div>

                <div className="mb-8 border-b border-gray-200 pb-4">
                    <select
                        id="orderFilter"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as 'available' | 'myOrders')}
                        className="bg-white border-2 border-[#FF441F] text-gray-900 text-sm rounded-xl focus:ring-[#FF441F] focus:border-[#FF441F] focus:outline-none block p-2.5 font-bold cursor-pointer shadow-sm transition-colors"
                    >
                        <option value="available">Ordenes Disponibles</option>
                        <option value="myOrders">Mis Pedidos en curso</option>
                    </select>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF441F]"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">
                            {activeTab === 'available' ? 'No hay órdenes disponibles' : 'No tienes pedidos en curso'}
                        </h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {orders.map((order) => {
                            return (
                                <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900">Orden #{order.id}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-black text-green-600">${order.total?.toLocaleString()}</span>
                                            <span className="text-sm font-bold text-gray-500">{order.paymentMethod}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                                        <h4 className="text-sm font-bold text-gray-700 mb-1">Dirección de entrega</h4>
                                        <p className="font-medium text-gray-900 flex items-start gap-2">
                                            {order.address}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <ul className="space-y-2">
                                            {order.items?.map((item: CartItem, idx: number) => (
                                                <li key={idx} className="flex justify-between items-center text-sm font-medium">
                                                    <span className="text-gray-900"><span className="text-gray-400 font-bold mr-2">{item.quantity}x</span> {item.product.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {activeTab === 'available' && (
                                        <button
                                            onClick={() => handleAcceptOrder(order.id)}
                                            className="w-full mt-4 bg-[#FF441F] hover:bg-[#e63d1c] text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-[#FF441F]/20 cursor-pointer"
                                        >
                                            Aceptar Pedido
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
