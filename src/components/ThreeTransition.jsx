'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'

export default function ThreeTransition({ active = false }) {
  if (!active) return null

  return (
    <Canvas className="fixed inset-0 z-50 pointer-events-none">
      <ambientLight intensity={0.5} />
      <motion.mesh
        initial={{ scale: 0, rotation: [0, 0, 0] }}
        animate={{ scale: 2, rotation: [Math.PI, Math.PI, 0] }}
        exit={{ scale: 0, rotation: [0, 0, 0] }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        position={[0, 0, -5]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff4081" />
      </motion.mesh>
    </Canvas>
  )
}
