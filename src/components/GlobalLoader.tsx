import React from 'react';
import { motion } from 'framer-motion';

export const GlobalLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
    >
      {/* Animated Circles */}
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#7042f88b] opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-[#7042f88b] opacity-40"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-[#7042f88b] opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4
          }}
        />
        
        {/* Center Dot */}
        <motion.div
          className="absolute inset-[42%] rounded-full bg-[#7042f88b]"
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7042f88b] to-[#403ddc] mb-2">
            providence
          </h2>
          <div className="flex items-center gap-2 text-[#a8c7fa]/60">
            <span className="text-sm uppercase tracking-wider">Loading</span>
            <motion.div
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-[#7042f88b]" />
              <span className="w-1 h-1 rounded-full bg-[#7042f88b]" />
              <span className="w-1 h-1 rounded-full bg-[#7042f88b]" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-4 h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#7042f88b] to-transparent"
        />
      </div>
    </motion.div>
  );
}; 