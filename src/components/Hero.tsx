import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const skewXRaw = useTransform(scrollVelocity, [-1, 1], ["45deg", "-45deg"]);
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -3000]);
  const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });

  return (
    <section ref={targetRef} className="h-[300vh] relative">
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514]">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7042f88b]/5 to-transparent" />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Hero Content */}
          <div className="flex items-center justify-center px-4 h-full">
            <div className="max-w-4xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              >
                Welcome to{" "}
                <span className="bg-gradient-to-r from-white to-[#a8c7fa] bg-clip-text text-transparent">
                  Providence f8
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-[#a8c7fa]/60 mb-8"
              >
                The future of digital collectibles
              </motion.p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/list">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-[#7042f88b] hover:bg-[#7042f88b]/80 rounded-xl transition-all duration-300"
                  >
                    Explore Collection
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-[#a8c7fa]/10 hover:bg-[#a8c7fa]/20 border border-[#a8c7fa]/20 rounded-xl transition-all duration-300"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>

          {/* Scrolling Text */}
          <motion.p
            style={{ skewX, x }}
            className="origin-left whitespace-nowrap text-4xl md:text-6xl font-black lowercase leading-[0.85] text-[#7042f88b]/10 py-8"
          >
            Providence NFT Collection • Exclusive Digital Art • Limited Edition
            NFTs • Unique Collectibles • Providence NFT Collection • Exclusive
            Digital Art • Limited Edition NFTs • Unique Collectibles
          </motion.p>

          {/* Scroll Indicators */}
          <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-xs text-[#a8c7fa]/40 lg:block">
            <span style={{ writingMode: "vertical-lr" }}>SCROLL</span>
            <FiArrowDown className="mx-auto mt-2" />
          </div>
          <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs text-[#a8c7fa]/40 lg:block">
            <span style={{ writingMode: "vertical-lr" }}>SCROLL</span>
            <FiArrowDown className="mx-auto mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
