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

export type AuthMode = "LOGIN" | "REGISTER" | null;
