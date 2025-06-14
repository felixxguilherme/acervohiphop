"use client";

import StackedPagesScroll from "@/components/ui/stack"
import { motion } from "motion/react"
export default function Audiovisual() {
  return (
    <div className="min-h-screen bg-green-500 pt-20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h1 className="text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Página de serviços com background verde. As transições são suaves e elegantes.
          </p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {['Web Design', 'Development', 'SEO', 'Marketing'].map((service, index) => (
              <motion.div
                key={service}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/20 p-6 rounded-lg backdrop-blur-sm cursor-pointer"
              >
                <h3 className="text-lg font-semibold mb-2">{service}</h3>
                <p className="text-sm">Serviço profissional de {service.toLowerCase()}.</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}