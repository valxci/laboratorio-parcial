export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    photo?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    address: string;
    paymentMethod: string;
    status?: string;
}
