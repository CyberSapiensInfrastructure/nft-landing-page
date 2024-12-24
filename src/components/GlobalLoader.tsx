import { motion } from 'framer-motion';

export const GlobalLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl font-orbitron"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-20 blur-[100px] animate-float" />
        <div className="absolute right-[20%] bottom-[30%] h-64 w-64 rounded-full bg-gradient-radial from-[#7042f860] to-transparent opacity-20 blur-[100px] animate-float-delay" />
      </div>

      {/* Animated Circles */}
      <div className="relative w-32 h-32">
        {/* Outer rotating circle */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#7042f88b]"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        
        {/* Middle circle with gradient */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: 'linear-gradient(45deg, #7042f88b, #403ddc)',
            opacity: 0.5
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        
        {/* Inner spinning circle */}
        <motion.div
          className="absolute inset-8 rounded-full bg-[#7042f88b]"
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="mt-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7042f88b] via-[#403ddc] to-[#7042f88b] uppercase tracking-wider mb-3"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 100%' }}
          >
            providence f8
          </motion.h2>
          <div className="flex items-center justify-center gap-3">
            <motion.span 
              className="text-sm uppercase tracking-[0.2em] text-[#a8c7fa]/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Loading
            </motion.span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#7042f88b]"
                  animate={{
                    y: [-2, 2, -2],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 h-[1px] w-48 mx-auto bg-gradient-to-r from-transparent via-[#7042f88b] to-transparent"
        />
      </div>

      {/* Particle Effects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#7042f88b]"
          animate={{
            y: [0, -20],
            x: [0, i % 2 === 0 ? 10 : -10],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          style={{
            left: `${50 + (Math.random() - 0.5) * 20}%`,
            top: `${50 + (Math.random() - 0.5) * 20}%`,
          }}
        />
      ))}
    </motion.div>
  );
}; 