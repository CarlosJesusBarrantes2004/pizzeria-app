"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Pizza as PizzaIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { CartItem } from "@/types";

export default function Navbar() {
  const { cart, setCartOpen, user, setAuthModalMode, logout } = useApp();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const cartItemCount = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  const handleProfileClick = () => {
    if (user) {
      setDropdownOpen(!isDropdownOpen);
    } else {
      setAuthModalMode("LOGIN");
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <PizzaIcon className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-orange-500 transition-colors">
              Pizza<span className="text-orange-500">&</span>Salsa
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-white/5 rounded-full transition-colors group hover:cursor-pointer"
            >
              <ShoppingBag className="h-6 w-6 text-gray-300 group-hover:text-orange-500 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                  {cartItemCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 hover:bg-white/5 px-3 py-2 rounded-full transition-colors hover:cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  <UserIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-300 hidden md:block">
                  {user ? user.username.split(" ")[0] : "Sign In"}
                </span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden py-1"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors hover:cursor-pointer"
                    >
                      <UserIcon className="h-4 w-4" />
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left hover:cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Salir
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
