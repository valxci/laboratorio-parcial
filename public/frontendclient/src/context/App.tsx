import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { Product, CartItem, Order } from '../types/types';

interface AppContextType {
    userId: number | null;
    setUserId: (id: number | null) => void;
    role: string;
    setRole: (role: string) => void;
    myStoreId: number | null;
    setMyStoreId: (id: number | null) => void;
    cart: CartItem[];
    setCart: Dispatch<SetStateAction<CartItem[]>>;
    orders: Order[];
    setOrders: Dispatch<SetStateAction<Order[]>>;
    handleAddToCart: (product: Product) => void;
    handleLogout: () => void;
}


const AppContext = createContext<AppContextType | null>(null);


export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
    return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [userId, setUserIdState] = useState<number | null>(() => {
        const saved = localStorage.getItem('rappi_userId');
        return saved ? Number(saved) : null;
    });
    const [role, setRoleState] = useState(() => localStorage.getItem('rappi_role') || '');
    const [myStoreId, setMyStoreIdState] = useState<number | null>(() => {
        const saved = localStorage.getItem('rappi_storeId');
        return saved ? Number(saved) : null;
    });
  
    const setUserId = (id: number | null) => {
        setUserIdState(id);
        if (id !== null) localStorage.setItem('rappi_userId', String(id));
        else localStorage.removeItem('rappi_userId');
    };
    const setRole = (r: string) => {
        setRoleState(r);
        if (r) localStorage.setItem('rappi_role', r);
        else localStorage.removeItem('rappi_role');
    };
    const setMyStoreId = (id: number | null) => {
        setMyStoreIdState(id);
        if (id !== null) localStorage.setItem('rappi_storeId', String(id));
        else localStorage.removeItem('rappi_storeId');
    };

    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);


    useEffect(() => {
        if (userId !== null) {
            try {
                const savedCart = localStorage.getItem(`rappi_cart_${userId}`);
                if (savedCart) setCart(JSON.parse(savedCart));
                else setCart([]);

                fetch(`/api/orders?client_id=${userId}`)
                    .then(res => res.json())
                    .then(data => { if (Array.isArray(data)) setOrders(data); else setOrders([]); })
                    .catch(() => setOrders([]));
            } catch {
                setCart([]);
                setOrders([]);
            }
        } else {
            setCart([]);
            setOrders([]);
        }
    }, [userId]);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        if (userId !== null) {
            localStorage.setItem(`rappi_cart_${userId}`, JSON.stringify(cart));
        }
    }, [cart, userId]);

    // Añadir producto al carrito
    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.product.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { product, quantity: 1 }];
        });
    };

    // Cerrar sesión limpia todo el estado
    const handleLogout = () => {
        setUserId(null);
        setRole('');
        setMyStoreId(null);
        setCart([]);
        setOrders([]);
    };

    return (
        <AppContext.Provider value={{
            userId, setUserId,
            role, setRole,
            myStoreId, setMyStoreId,
            cart, setCart,
            orders, setOrders,
            handleAddToCart,
            handleLogout
        }}>
            {children}
        </AppContext.Provider>
    );
}
