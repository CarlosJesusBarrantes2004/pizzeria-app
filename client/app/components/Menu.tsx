"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import api from "@/lib/axios";
import { Pizza } from "@/types";

export default function Menu() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useApp();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await api.get("/pizzas");
        setPizzas(response.data);
      } catch (error) {
        console.error("Error cargando pizzas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  return (
    <section id="menu-section" className="py-20 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Nuestro Menú
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explora nuestra amplia variedad de pizzas artesanales. Elaboradas
            con ingredientes frescos y horneadas a la perfección.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 bg-white/5 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {pizzas.map((pizza) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={pizza.id}
                  className="group bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={pizza.imageUrl}
                      alt={pizza.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                      {pizza.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                      {pizza.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-xl font-bold text-white">
                        ${pizza.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(pizza)}
                        className="bg-white text-black p-2 hover:cursor-pointer rounded-xl hover:bg-orange-500 hover:text-white transition-colors duration-300"
                        aria-label="Añadir al carrito"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
