"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Receipt,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import api from "@/lib/axios";

export default function ProfileView() {
  const { user } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");

        console.log(response);

        setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "PREPARING":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "CANCELLED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      case "PREPARING":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
          <p className="text-gray-400 mt-2">
            Gestiona tu cuenta y consulta pedidos anteriores.
          </p>
        </motion.div>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 flex items-center gap-6 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-orange-500/20">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 font-medium">
              Pizza Lover Status: Gold 🏆
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Historial de Pedidos{" "}
            {orders.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({orders.length})
              </span>
            )}
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-white/5 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-[#1a1a1a] rounded-2xl border border-dashed border-white/10">
              <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                You haven't placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-white">
                            Order #{order.id}
                          </span>
                          <span
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-orange-500">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    {/* Items de la orden mapeados desde el backend */}
                    <div className="space-y-3">
                      {order.items?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-black/30 p-3 rounded-xl"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={item.pizza?.imageUrl}
                              alt={item.pizza?.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {item.pizza?.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Unit Price: ${item.pizza?.price}
                            </p>
                          </div>
                          <div className="text-sm text-gray-300">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-sm font-medium text-white">
                            ${(item.pizza?.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                      <Receipt className="h-4 w-4" /> View Receipt
                    </button>
                    <button className="flex items-center gap-2 text-sm text-orange-500 font-medium hover:text-orange-400 transition-colors">
                      <RefreshCcw className="h-4 w-4" /> Reorder
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
