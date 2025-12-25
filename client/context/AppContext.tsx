"use client";

import api from "@/lib/axios";
import { AuthMode, CartItem, Pizza, User } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

interface AppContextType {
  // State
  cart: CartItem[];
  pizzas: Pizza[];
  user: User | null;
  isCartOpen: boolean;
  authModalMode: AuthMode;
  loading: boolean;

  // Actions
  setPizzas: (pizzas: Pizza[]) => void;
  addToCart: (pizza: Pizza) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  setAuthModalMode: (mode: AuthMode) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>(null);
  const [loading, setLoading] = useState(true);

  // Cart Hydration (Avoids Server-Side Rendering Errors)
  useEffect(() => {
    const savedCart = localStorage.getItem("pizzeria-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart", error);
      }
    }

    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (e) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Cart persistence
  useEffect(() => {
    localStorage.setItem("pizzeria-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((pizza: Pizza) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === pizza.id);
      if (existing) {
        return prev.map((item) =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setCart([]);
      localStorage.removeItem("pizzeria-cart");
    }
  };

  const value = useMemo(
    () => ({
      cart,
      pizzas,
      user,
      isCartOpen,
      authModalMode,
      loading,
      setPizzas,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart: () => setCart([]),
      setCartOpen,
      setAuthModalMode,
      setUser,
      logout,
    }),
    [
      cart,
      pizzas,
      user,
      isCartOpen,
      authModalMode,
      loading,
      addToCart,
      updateQuantity,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
