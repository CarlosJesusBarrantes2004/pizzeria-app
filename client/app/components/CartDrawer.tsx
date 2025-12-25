"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import api from "@/lib/axios";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    user,
    setAuthModalMode,
  } = useApp();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = 2.99;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleCheckout = async () => {
    if (!user) {
      setAuthModalMode("LOGIN");
      onClose();
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          pizzaId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders", orderData);

      if (response.status === 200 || response.status === 201) {
        alert("¡Pedido realizado con éxito!");
        clearCart();
        onClose();
      }
    } catch (error: any) {
      console.error("Error al procesar la orden:", error);
      alert(
        error.response?.data?.message || "Error al conectar con el servidor"
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
                <span className="bg-white/5 text-gray-400 text-xs px-2 py-1 rounded-md">
                  {cart.length} {cart.length == 1 ? "pedido" : "pedidos"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:cursor-pointer hover:bg-white/10 rounded-full transition-colors hover:cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Tu Carito está Vacío
                  </h3>
                  <p className="text-gray-500 max-w-xs">
                    Parece que aún no has añadido ninguna pizza deliciosa.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 hover:cursor-pointer bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors mt-4"
                  >
                    Comience a Realizar Pedidos
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="rounded-xl object-cover bg-[#1a1a1a]"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-white group-hover:text-orange-500 transition-colors">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:cursor-pointer hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1 border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Minus className="h-3 w-3 text-white" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Plus className="h-3 w-3 text-white" />
                          </button>
                        </div>
                        <div className="text-sm font-bold text-white ml-auto">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-[#1a1a1a] border-t border-white/10 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Gastos de envío</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 hover:cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {user
                    ? "Confirmar Pedido"
                    : "Inicia sesión para finalizar la compra"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
