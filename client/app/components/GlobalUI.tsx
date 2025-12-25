"use client";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import AiChef from "./AiChef";
import { useApp } from "@/context/AppContext";

export default function GlobalUI() {
  const { isCartOpen, setCartOpen, authModalMode, setAuthModalMode } = useApp();

  return (
    <>
      <Navbar />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal mode={authModalMode} onClose={() => setAuthModalMode(null)} />
      <AiChef />
    </>
  );
}
