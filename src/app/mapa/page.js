"use client";

import StackedPagesScroll from "@/components/ui/stack"
import { motion } from "motion/react"
import { CartoonButton } from "@/components/ui/cartoon-button";
export default function Mapa() {
  return (
    <div className="min-h-screen bg-purple-500 pt-20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h1 className="text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Entre em contato conosco! Background roxo com animações elegantes.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white/20 p-8 rounded-lg backdrop-blur-sm">
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded bg-white/30 border border-white/50 text-white placeholder-white/70"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 rounded bg-white/30 border border-white/50 text-white placeholder-white/70"
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Mensagem</label>
                  <textarea
                    className="w-full p-3 rounded bg-white/30 border border-white/50 text-white placeholder-white/70 h-24"
                    placeholder="Sua mensagem..."
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <CartoonButton className="w-full bg-white text-purple-500 hover:bg-gray-100">
                    Enviar Mensagem
                  </CartoonButton>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}