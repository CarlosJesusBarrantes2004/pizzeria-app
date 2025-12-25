"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import api from "@/lib/axios";
import { AuthMode } from "@/types";

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
}

export default function AuthModal({ mode, onClose }: AuthModalProps) {
  const { setUser, setAuthModalMode } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password || (mode === "REGISTER" && !email)) {
      setError("Por favor, rellena todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "LOGIN") {
        const response = await api.post("/auth/login", {
          username,
          password,
        });

        console.log(response);

        setUser(response.data);
        onClose();
      } else {
        await api.post("/auth/register", {
          username,
          email,
          password,
        });

        setAuthModalMode("LOGIN");
        setError("¡Cuenta creada! Ahora puedes iniciar sesión.");
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Error en la conexión con el servidor"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setAuthModalMode(mode === "LOGIN" ? "REGISTER" : "LOGIN");
    setError("");
  };

  return (
    <AnimatePresence>
      {mode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:cursor-pointer hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {mode === "LOGIN" ? "¡Bienvenido de nuevo!" : "Únete al club"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mode === "LOGIN"
                    ? "Inicie sesión para acceder a sus pedidos y favoritos."
                    : "Regístrate y obtén un 50% de descuento en tu primer pedido."}
                </p>
              </div>

              {error && (
                <div
                  className={`mb-6 p-3 border rounded-xl flex items-center gap-3 text-sm ${
                    error.includes("creada")
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Nombre de Usuario
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="Juan"
                    />
                  </div>
                </div>

                {mode === "REGISTER" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-orange-500 transition-all"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 hover:cursor-pointer text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === "LOGIN" ? "Entrar" : "Crear Cuenta"}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {mode === "LOGIN"
                    ? "¿No tienes una cuenta? "
                    : "¿Ya tienes una cuenta? "}
                  <button
                    onClick={switchMode}
                    className="text-orange-500 font-medium hover:underline hover:cursor-pointer"
                  >
                    {mode === "LOGIN" ? "Crear Cuenta" : "Entrar"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
