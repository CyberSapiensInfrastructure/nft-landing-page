import React from 'react';
import { motion } from 'framer-motion';

export const GlobalLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0c0c0c] flex items-center justify-center z-50"
    >
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 blur-3xl opacity-30">
          <div className="absolute inset-0 bg-gradient-conic from-purple-600 via-blue-500 to-purple-600 animate-spin-slow" />
        </div>

        {/* Main loader circles */}
        <div className="relative">
          {/* Outer rotating circle */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-[#7042f88b] to-[#3e2483] p-0.5"
          >
            <div className="w-full h-full rounded-full bg-[#0c0c0c]" />
          </motion.div>

          {/* Middle pulsing circle */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#7042f88b] to-[#3e2483] opacity-75 blur-sm" />
          </motion.div>

          {/* Inner spinning circle */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7042f88b] to-[#3e2483] p-0.5">
              <div className="w-full h-full rounded-full bg-[#0c0c0c] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7042f88b] to-[#3e2483] blur-sm opacity-75" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Providence text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-3 tracking-wider">
            Providence
          </h2>
          <div className="flex items-center gap-3 text-[#a8c7fa]/60">
            {/* Animated dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 rounded-full bg-[#7042f88b]"
              />
            ))}
          </div>
        </motion.div>

        {/* Decorative particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 rounded-full bg-[#7042f88b]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}; 