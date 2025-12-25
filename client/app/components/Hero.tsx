"use client";

import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu-section");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 flex flex-col-reverse lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-orange-500 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            #1 Entrega de pizza en la ciudad
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Saborea la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
              Magia
            </span>{" "}
            <br />
            en Cada Porción
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Masa amasada a mano, ingredientes artesanales y horneada a la
            perfección en nuestros hornos de piedra. Disfrute de una pizza como
            nunca antes.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={scrollToMenu}
              className="px-8 py-4 bg-orange-500 hover:cursor-pointer hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all hover:scale-105 flex items-center gap-2 group"
            >
              Ordenar Ahora
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-[#1a1a1a] border border-white/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 rounded-full border-2 border-[#1a1a1a] overflow-hidden"
                  >
                    <Image
                      src={`https://picsum.photos/seed/${i + 10}/32/32`}
                      fill
                      alt="avatar"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">500+ Opiniones</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="relative z-10 w-full max-w-md mx-auto lg:max-w-full">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"
                alt="Delicious Pizza"
                fill
                priority // Carga esta imagen con prioridad (LCP)
                className="object-cover hover:scale-[1.05] transition-transform duration-700"
              />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="bg-green-500/20 p-2 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Delivery Time
                </p>
                <p className="text-lg font-bold text-white">~ 30 Mins</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
