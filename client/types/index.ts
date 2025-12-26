export interface Pizza {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface CartItem extends Pizza {
  quantity: number;
}

export interface User {
  username: string;
  email: string;
  role: string;
}

export interface OrderItem {
  pizzaName: string;
  pizzaImage: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export type AuthMode = "LOGIN" | "REGISTER" | null;
