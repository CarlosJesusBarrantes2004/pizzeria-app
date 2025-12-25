"use client";

import { useState } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";

export default function AiChef() {
  const { pizzas } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPizzaId, setSuggestedPizzaId] = useState<string | null>(null);

  const handleAskChef = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse("");
    setSuggestedPizzaId(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        setResponse(
          "¡Ciao! Mi horno está apagado (Falta API Key). Pero te recomiendo la Pizza del Chef."
        );
        setIsLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const menuContext = pizzas
        .map((p) => `${p.name}: ${p.description}`)
        .join("\n");

      const promptContext = `
        Eres Luigi, un experto Chef Pizzero Italiano con mucha personalidad. 
        REGLAS:
        1. Recomienda solo UNA pizza del siguiente MENÚ basado en lo que pide el cliente:
        ${menuContext}
        2. Tu respuesta debe ser corta, alegre y en español.
        3. Menciona el nombre de la pizza en negrita.
        4. Si preguntan algo que no es comida, gentilmente di que solo sabes de pizzas.
      `;

      const result = await model.generateContent([promptContext, prompt]);
      const text = result.response.text();

      setResponse(text);

      const foundPizza = pizzas.find((p) =>
        text.toLowerCase().includes(p.name.toLowerCase())
      );
      if (foundPizza) {
        setSuggestedPizzaId(foundPizza.id.toString());
      }
    } catch (error) {
      console.error("AI Error:", error);
      setResponse(
        "¡Mamma Mia! Algo salió mal en la cocina. ¡Prueba nuestra Pepperoni clásica!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-pink-600 text-white p-4 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center group"
      >
        <Sparkles className="h-6 w-6 animate-pulse" />
        <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Pregunta al Chef Luigi
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 sm:bottom-24 right-0 sm:right-6 w-full sm:w-96 bg-[#0a0a0a] border border-white/10 sm:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header Luigi */}
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      Chef Luigi AI
                    </h3>
                    <p className="text-white/80 text-xs">Experto Pizzero</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Área de Chat */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-[#0a0a0a] min-h-[300px]">
                <div className="flex gap-3">
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-gray-300">
                    ¡Ciao! Soy Luigi. ¿Qué sabores buscas hoy? ¿Picante, mucho
                    queso, algo veggie? ¡Dímelo y te recomendaré la mejor pizza!
                  </div>
                </div>

                {response && (
                  <div className="flex gap-3">
                    <div className="bg-orange-500/10 rounded-2xl rounded-tl-none p-4 text-sm text-gray-300 border border-orange-500/20">
                      {response}
                      {suggestedPizzaId && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              document
                                .getElementById("menu-section")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="text-orange-500 font-bold hover:underline"
                          >
                            Ver en el Menú &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex gap-2 p-4">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                )}
              </div>

              {/* Formulario */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskChef();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Quiero algo con mucho queso..."
                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
