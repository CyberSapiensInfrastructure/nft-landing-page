import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import nftImage from '../assets/img/nft.jpg';

const MouseImageTrail = ({
  children,
  images,
  renderImageBuffer,
  rotationRange,
}: {
  children: ReactNode;
  images: string[];
  renderImageBuffer: number;
  rotationRange: number;
}) => {
  const [scope, animate] = useAnimate();
  const lastRenderPosition = useRef({ x: 0, y: 0 });
  const imageRenderCount = useRef(0);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    const { clientX, clientY } = e;
    const distance = calculateDistance(
      clientX,
      clientY,
      lastRenderPosition.current.x,
      lastRenderPosition.current.y
    );

    if (distance >= renderImageBuffer) {
      lastRenderPosition.current.x = clientX;
      lastRenderPosition.current.y = clientY;
      renderNextImage();
    }
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  const renderNextImage = () => {
    const imageIndex = imageRenderCount.current % images.length;
    const selector = `[data-mouse-move-index="${imageIndex}"]`;
    const el = document.querySelector(selector) as HTMLElement;

    el.style.top = `${lastRenderPosition.current.y}px`;
    el.style.left = `${lastRenderPosition.current.x}px`;
    el.style.zIndex = imageRenderCount.current.toString();

    const rotation = Math.random() * rotationRange;

    animate(
      selector,
      {
        opacity: [0, 1],
        transform: [
          `translate(-50%, -25%) scale(0.5) ${imageIndex % 2 ? `rotate(${rotation}deg)` : `rotate(-${rotation}deg)`}`,
          `translate(-50%, -50%) scale(1) ${imageIndex % 2 ? `rotate(-${rotation}deg)` : `rotate(${rotation}deg)`}`,
        ],
      },
      { type: "spring", damping: 15, stiffness: 200 }
    );

    animate(
      selector,
      { opacity: [1, 0] },
      { ease: "linear", duration: 0.5, delay: 1 }
    );

    imageRenderCount.current = imageRenderCount.current + 1;
  };

  return (
    <div ref={scope} className="relative overflow-hidden" onMouseMove={handleMouseMove}>
      {children}
      {images.map((img, index) => (
        <img
          className="pointer-events-none absolute left-0 top-0 h-36 w-auto rounded-xl border border-[#a8c7fa]/20 bg-[#0c0c0c]/80 object-cover opacity-0"
          src={img}
          alt={`Mouse move image ${index}`}
          key={index}
          data-mouse-move-index={index}
        />
      ))}
    </div>
  );
};

const Watermark = ({ reverse, text }: { reverse?: boolean; text: string }) => (
  <div className="flex -translate-y-12 select-none overflow-hidden">
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
      className="flex"
    >
      <span className="w-fit whitespace-nowrap text-[20vmax] font-black uppercase leading-[0.75] text-[#7042f88b]/5">
        {text}
      </span>
      <span className="ml-48 w-fit whitespace-nowrap text-[20vmax] font-black uppercase leading-[0.75] text-[#7042f88b]/5">
        {text}
      </span>
    </motion.div>
  </div>
);

const WatermarkWrapper = () => (
  <>
    <Watermark text="Providence" />
    <Watermark text="NFT" reverse />
    <Watermark text="Collection" />
    <Watermark text="Exclusive" reverse />
  </>
);

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

  // NFT resimleri için array oluştur
  const images = Array(16).fill(nftImage);

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
                  Providence
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#7042f88b] hover:bg-[#7042f88b]/80 rounded-xl transition-all duration-300"
                >
                  Explore Collection
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#a8c7fa]/10 hover:bg-[#a8c7fa]/20 border border-[#a8c7fa]/20 rounded-xl transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Scrolling Text */}
          <motion.p
            style={{ skewX, x }}
            className="origin-left whitespace-nowrap text-4xl md:text-6xl font-black uppercase leading-[0.85] text-[#7042f88b]/10 py-8"
          >
            Providence NFT Collection • Exclusive Digital Art • Limited Edition NFTs • Unique Collectibles • 
            Providence NFT Collection • Exclusive Digital Art • Limited Edition NFTs • Unique Collectibles
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