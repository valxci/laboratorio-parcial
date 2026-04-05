import { useState, useEffect } from "react";
import rappiLogo from "../../assets/rappiLogo.png";
import { useNavigate } from 'react-router';
import { useApp } from '../../context/App';

interface Product {
    id: number;
    name: string;
    price: number;
    photo?: string;
}

export default function StoreDashboard() {
    const navigate = useNavigate();
    const { myStoreId, handleLogout } = useApp();
    const storeId = myStoreId!;
    const [storeName, setStoreName] = useState<string>("Tienda");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", photo: "" });
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                // Buscamos la tienda en la lista de tiendas
                const res = await fetch("/api/stores");
                if (res.ok) {
                    const stores = await res.json();
                    const myStore = stores.find((s: any) => s.id === storeId);
                    if (myStore) {
                        setStoreName(myStore.name);
                        setIsOpen(myStore.is_open);
                    }
                }

                // Buscamos los productos de la tienda
                const resProducts = await fetch(`/api/stores/${storeId}/products`);
                if (resProducts.ok) {
                    const productsData = await resProducts.json();
                    setProducts(productsData);
                }
            } catch (err) {
                console.error("Error al cargar datos de la tienda", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [storeId]);

    const toggleStatus = async () => {
        const newStatus = !isOpen;
        setIsOpen(newStatus); // Actualizamos la UI inmediatamente (optimista)
        try {
            await fetch(`/api/stores/${storeId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_open: newStatus })
            });
        } catch (e) {
            console.error("Error cambiando estado:", e);
            setIsOpen(!newStatus); // Revertimos si falla
        }
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProduct(true);
        try {
            const res = await fetch(`/api/stores/${storeId}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newProduct.name,
                    price: parseFloat(newProduct.price),
                    photo: newProduct.photo
                })
            });

            if (res.ok) {
                const addedProduct = await res.json();
                setProducts([...products, addedProduct]);
                setNewProduct({ name: "", price: "", photo: "" }); // Limpiamos el formulario
                setMessage({ type: "success", text: "¡Producto agregado con éxito!" });
            } else {
                const errorData = await res.json();
                throw new Error(errorData.error || "Algo salió mal");
            }
        } catch (err: any) {
            console.error("Error al crear producto:", err);
            setMessage({ type: "error", text: err.message || "Error agregando producto" });
        } finally {
            setLoadingProduct(false);
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

            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <img src={rappiLogo} alt="Rappi Logo" className="h-10 object-contain" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF441F]"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Hola, {storeName}</h1>
                                <p className="text-gray-500 font-medium mt-2">Administra el estado y los productos de tu negocio.</p>
                            </div>
                            <button
                                onClick={() => { handleLogout(); navigate('/'); }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-6 rounded-full text-sm transition-colors self-start sm:self-auto cursor-pointer"
                            >
                                Cerrar sesión
                            </button>
                        </div>


                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between mb-8">
                            <div className="text-center md:text-left mb-6 md:mb-0">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Estado Actual</h2>
                                <p className="text-gray-500 font-medium max-w-sm">
                                    Si tu tienda está cerrada, los clientes no podrán verla ni pedir productos.
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className={`flex items-center gap-2 text-lg font-black mb-4 px-5 py-2 rounded-full ${isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    <span className={`w-3 h-3 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
                                    {isOpen ? "ABIERTO" : "CERRADO"}
                                </div>
                                <button
                                    onClick={toggleStatus}
                                    className={`px-8 py-3 rounded-full font-bold text-white transition-all duration-200 shadow-md hover:-translate-y-0.5 active:scale-95 ${isOpen ? "bg-gray-900 hover:bg-black shadow-gray-900/30" : "bg-[#FF441F] hover:bg-[#e63d1c] shadow-[#FF441F]/30"}`}
                                >
                                    {isOpen ? "Cerrar Tienda" : "Abrir Tienda"}
                                </button>
                            </div>
                        </div>

                        {/* card producto */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Agregar Producto Nuevo</h2>
                            <form onSubmit={handleAddProduct} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="w-full md:w-1/3">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del producto</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newProduct.name}
                                        onChange={handleProductChange}
                                        placeholder="Ej: Hamburguesa Sencilla"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FF441F] focus:outline-none text-sm transition-colors text-black font-medium"
                                    />
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">URL de la Imagen</label>
                                    <input
                                        type="url"
                                        name="photo"
                                        value={newProduct.photo}
                                        onChange={handleProductChange}
                                        placeholder="https://..."
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FF441F] focus:outline-none text-sm transition-colors text-black font-medium"
                                    />
                                </div>
                                <div className="w-full md:w-1/4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Precio</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleProductChange}
                                        placeholder="0.00"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FF441F] focus:outline-none text-sm transition-colors text-black font-medium"
                                    />
                                </div>
                                <div className="w-full md:w-auto">
                                    <button
                                        type="submit"
                                        disabled={loadingProduct}
                                        className="w-full h-[52px] bg-[#FF441F] hover:bg-[#e63d1c] text-white px-8 rounded-full font-bold transition-transform hover:-translate-y-0.5 active:scale-95 disabled:bg-gray-400"
                                    >
                                        {loadingProduct ? "..." : "Agregar"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Lista de Productos de la Tienda */}
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Tus Productos </h2>
                            {products.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="text-5xl mb-3">📦</div>
                                    <p className="text-gray-900 font-bold text-lg">Aún no tienes productos</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {products.map(p => (
                                        <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                                            <div className="h-40 w-full bg-gray-100 overflow-hidden relative">
                                                {p.photo ? (
                                                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl">🍲</div>
                                                )}
                                            </div>
                                            <div className="p-5 flex flex-col justify-between">
                                                <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{p.name}</h3>
                                                <p className="text-[#FF441F] font-black text-xl">${Number(p.price).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
