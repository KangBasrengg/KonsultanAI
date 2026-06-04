"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ParticleBackgroundProps {
  count?: number;
}

export default function ParticleBackground({ count = 25 }: ParticleBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [count]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/40 shadow-[0_0_8px_2px_rgba(234,179,8,0.3)]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -200],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
